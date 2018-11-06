var plan = require('flightplan');

var config = {
  projectDir: '/opt/www/jacs-dashboard', // location on the remote server
  keepReleases: 3,
};

plan.target(
  'development', {
    host: '10.36.13.17', // jacs-dev
    username: 'jacs'
  },
  {
    gitCheck: true,
  },
);

plan.target(
  'production', {
    host: '10.36.13.2', // jacs2
    username: 'jacs',
    agent: process.env.SSH_AUTH_SOCK,
  },
  {
    // Shouldn't be overridden, so please don't try.
    gitCheck: true,
  },
);

// Check if there are files that have not been committed to git. This stops
// us from deploying code in an inconsistent state. It also prevents slapdash
// changes from being deployed without a log of who added them in github. Not
// fool proof, but better than nothing.
plan.local('deploy', function (local) {
  if (plan.runtime.target === 'production' || plan.runtime.options.gitCheck) {
    local.log('checking git status...');
    var result = local.exec('git status --porcelain', { silent: true });

    if (result.stdout) {
      local.log(result.stdout);
      plan.abort('Uncommited files found, see list above');
    }
  } else {
    local.log('skipping git check!!!');
  }
});


plan.remote('deploy', function (remote) {
  config.deployTo = config.projectDir + '/releases/' + (new Date().getTime());
  remote.log('Creating webroot');
  remote.exec('mkdir -p ' + config.deployTo);
});

// Gets a list of files that git knows about and sends them to the
// target.
plan.local('deploy', function (local) {
  local.log('Transferring website files');
  var files = local.git('ls-files', {silent: true});
  local.transfer(files, config.deployTo + '/');
});

plan.remote('deploy', function(remote) {
  remote.log('Setup necessary symbolic links');
  remote.exec('ln -s ' + config.projectDir + '/settings.json ' + config.deployTo + '/src/settings.json');
});

plan.remote('deploy', function(remote) {
  remote.log('Run npm install');
  remote.exec('cd ' + config.deployTo + '; export PATH=/opt/www/bin:$PATH; /opt/www/bin/npm install');
});

plan.remote('deploy', function(remote) {
  remote.log('Run npm run build');
  remote.exec('cd ' + config.deployTo + '; export PATH=/opt/www/bin:$PATH; /opt/www/bin/npm run build');
});

plan.remote('deploy',function (remote) {
  remote.log('Linking to new release');
  remote.exec('ln -nfs ' + config.deployTo + ' ' +
    config.projectDir + '/current');

  remote.log('Checking for stale releases');
  var releases = getReleases(remote);

  if (releases.length > config.keepReleases) {
    var removeCount = releases.length - config.keepReleases;
    remote.log('Removing ' + removeCount + ' stale release(s)');

    releases = releases.slice(0, removeCount);
    releases = releases.map(function (item) {
      return config.projectDir + '/releases/' + item;
      });

    remote.exec('rm -rf ' + releases.join(' '));
  }
});

// The below code is not needed for this site as we generate a stitc bundle, which can be served
// via an nginx server. Therefore, we don't need to restart the server, just change the content.
/*
plan.remote(['deploy', 'restart', 'stop'], function(remote) {
  remote.log('Stop pm2');
  remote.exec('cd ' + config.projectDir + '; export PATH=/opt/www/bin:$PATH; pm2 stop webstation');
});

plan.remote(['deploy', 'restart', 'start'], function(remote) {
  remote.log('Start pm2');
  remote.exec('cd ' + config.projectDir + '; export PATH=/opt/www/bin:$PATH; pm2 start ecosystem.json --env production');
});

plan.remote(['deploy', 'status'], function(remote) {
  remote.exec('cd ' + config.projectDir + '; export PATH=/opt/www/bin:$PATH; pm2 status');
});
*/

plan.remote('rollback', function(remote) {
  remote.log('Rolling back release');
  var releases = getReleases(remote);
  if (releases.length > 1) {
    var oldCurrent = releases.pop();
    var newCurrent = releases.pop();
    remote.log('Linking current to ' + newCurrent);
    remote.exec('ln -nfs ' + config.projectDir + '/releases/' + newCurrent + ' '
      + config.projectDir + '/current');

    remote.log('Removing ' + oldCurrent);
    remote.exec('rm -rf ' + config.projectDir + '/releases/' + oldCurrent);
  }

});

plan.remote(['default','uptime'], function(remote) {
  remote.exec('uptime');
  remote.exec('whoami');
});

function getReleases(remote) {
  var releases = remote.exec('ls ' + config.projectDir +
    '/releases', {silent: true});

  if (releases.code === 0) {
    releases = releases.stdout.trim().split('\n');
    return releases;
  }

  return [];
}

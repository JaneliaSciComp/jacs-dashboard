export function isAdminUser(userObject) {
  return userObject.userGroupRoles.filter(
    e => e.groupKey.match(/^group:admin$/),
  ).length >= 1;
}

export function isInGroup(userObject, group) {
  return userObject.userGroupRoles.filter(
    e => e.groupKey.match(`^${group}$`),
  ).length >= 1;
}

export function hasPermission(userObject, domainObject) {
  let permission = null;
  // if owner then short circuit and return full permissions
  if (domainObject.ownerKey === userObject.key) {
    return 'write';
  }
  // if admin, do the same.
  if (isAdminUser(userObject)) {
    return 'write';
  }

  // if not owner then loop over the user.userGroupRoles
  const writeRoles = userObject.userGroupRoles.filter(group => group.role === 'Writer');
  // Read and write permissions can be granted to a group or a single user,
  // so we need to make sure the user key is checked against the domain object
  // write roles as well as their groups.
  writeRoles.push({ groupKey: userObject.key });
  writeRoles.forEach((group) => {
    // for this role, check the domainObject
    domainObject.writers.forEach((writePerm) => {
      if (group.groupKey === writePerm) {
        permission = 'write';
      }
    });
  });

  // still don't have write permission, so check read permission.
  if (!permission) {
    const readRoles = userObject.userGroupRoles.filter(group => group.role === 'Reader');
    // need to make sure the user is checked as well as their groups.
    readRoles.push({ groupKey: userObject.key });
    readRoles.forEach((group) => {
      // for this role, check the domainObject
      domainObject.readers.forEach((readPerm) => {
        if (group.groupKey === readPerm) {
          permission = 'read';
        }
      });
    });
  }
  // finally send it back
  return permission;
}

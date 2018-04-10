import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import queryString from 'query-string';


class SortableTableHeader extends React.Component {
  handleSortChange = (columnId, order) => () => {
    const { history, location } = this.props;

    // TODO: need to invert the order
    const invertedOrder = (order === 'desc') ? 'asc' : 'desc';

    const sortBy = `${columnId} ${invertedOrder}`;

    const parsedQuery = queryString.parse(location.search);
    parsedQuery['sort-by'] = sortBy;

    const updatedQuery = queryString.stringify(parsedQuery);

    const sortedUrl = `${location.pathname}?${updatedQuery}`;

    history.push(sortedUrl);
  }

  render() {
    const {
      columns,
      sortBy,
    } = this.props;

    const [orderBy, order] = sortBy.split(' ');

    return (
      <TableHead>
        <TableRow>
          {columns.map((column) => {
            return (
              <TableCell
                key={column.id}
                padding="none"
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement="bottom-end"
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.handleSortChange(column.id, order)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }
}

SortableTableHeader.propTypes = {
  sortBy: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default SortableTableHeader;

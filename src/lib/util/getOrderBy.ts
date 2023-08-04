export const getOrderBy = (order: string | undefined | null) => {
  const insertObject: { [key: string]: string } = {};

  if (order) {
    const orderSplit = order.split(',');
    for (const column of orderSplit) {
      const columnName = column.startsWith('-') ? column.slice(1) : column;
      const sortOrder = column.startsWith('-') ? 'desc' : 'asc';
      insertObject[columnName] = sortOrder;
    }
  } else {
    insertObject['id'] = 'desc';
  }

  return insertObject;
};

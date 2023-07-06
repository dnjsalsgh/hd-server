export const getOrderBy = (
  order: string | undefined | null,
  entity: string,
) => {
  if (!order) return ['id', 'DESC'];

  const orderList = order.split(',');
};

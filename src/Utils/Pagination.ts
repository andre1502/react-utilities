export const getItemRow = (index: number, page?: number, pageSize?: number) => {
  page = page ?? 0;

  if (page > 0) {
    page = page - 1;
  }

  return (pageSize ?? 0) * page + index + 1;
};

export const getNextPage = (
  page?: number,
  pageSize?: number,
  totalRecords?: number,
): number | undefined => {
  let totalPage = 0;

  page = (page ?? 0) + 1;

  if (pageSize && totalRecords) {
    totalPage = Math.ceil(totalRecords / pageSize);
  }

  if (page > totalPage) {
    page = undefined;
  }

  return page;
};

export const getTotalPages = (
  pageSize?: number,
  totalRecords?: number,
): number => {
  let totalPage = 0;

  if (pageSize && totalRecords) {
    totalPage = Math.ceil(totalRecords / pageSize);
  }

  return totalPage || 1;
};

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function getPagination(
  rawPage?: unknown,
  rawLimit?: unknown,
  maxLimit = 50,
  defaultLimit = 10
): PaginationParams {
  const pageNumber = Number(rawPage);
  const limitNumber = Number(rawLimit);

  const page = !isNaN(pageNumber) && pageNumber > 0 ? Math.floor(pageNumber) : 1;
  let limit = !isNaN(limitNumber) && limitNumber > 0 ? Math.floor(limitNumber) : defaultLimit;

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
  };
}

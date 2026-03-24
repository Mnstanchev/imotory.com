import { Prisma } from '@prisma/client';

/**
 * Type for select fields configuration
 */
export type SelectFields<T> = {
  [K in keyof T]?: boolean | object;
};

/**
 * Utility function to create optimized select fields for Prisma queries
 * Only selects the fields that are actually needed
 */
export function createSelect<T>(fields: Array<keyof T>): SelectFields<T> {
  return fields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as SelectFields<T>);
}

/**
 * Type for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Creates pagination parameters for Prisma queries
 */
export function createPaginationQuery(params: PaginationParams): { take: number; skip: number; orderBy?: any } {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const skip = (page - 1) * limit;

  const query: { take: number; skip: number; orderBy?: any } = {
    take: limit,
    skip
  };

  if (params.orderBy) {
    query.orderBy = {
      [params.orderBy]: params.orderDirection ?? 'desc'
    };
  }

  return query;
}

/**
 * Creates an optimized include object for related data
 */
export function createInclude<T>(relations: Array<keyof T>, selectFields?: Partial<Record<keyof T, string[]>>): any {
  return relations.reduce((acc, relation) => {
    acc[relation as string] = selectFields?.[relation] 
      ? { select: createSelect(selectFields[relation] as string[]) }
      : true;
    return acc;
  }, {} as any);
}

/**
 * Batch query helper for efficient data loading
 */
export async function batchQuery<T, K>(
  ids: K[],
  queryFn: (batchIds: K[]) => Promise<T[]>,
  batchSize = 100
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const batchResults = await queryFn(batchIds);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Creates a where clause with optimized indexing for common queries
 */
export function createWhereClause<T>(
  filters: Partial<T>,
  searchFields?: Array<keyof T>,
  searchTerm?: string
): any {
  const where: any = { ...filters };

  if (searchTerm && searchFields?.length) {
    where.OR = searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive'
      }
    }));
  }

  return where;
}
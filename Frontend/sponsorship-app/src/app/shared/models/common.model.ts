export class ApiResponse<T> {
  success: boolean = false;
  message: string = '';
  data?: T;
  errors?: string[];

  constructor(data?: Partial<ApiResponse<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class PagedResult<T> {
  items: T[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(data?: Partial<PagedResult<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class FilterDto {
  pageNumber: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';
  sortBy: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(data?: Partial<FilterDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

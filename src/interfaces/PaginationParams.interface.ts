export interface PaginationParams {
    page?: number | string;
    limit?: number | string;
    filter?: string;
}

export interface PaginateOptions {
    page?: number | string;
    limit?: number | string;
    where?: any;
    orderBy?: any;
}
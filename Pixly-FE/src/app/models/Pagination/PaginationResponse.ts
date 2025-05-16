import { PaginationHeader } from './PaginationHeader';

export interface PaginationResponse<T> {
    data?: T;
    pagination: PaginationHeader;
}
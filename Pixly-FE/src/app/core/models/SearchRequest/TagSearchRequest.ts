import { PaginationHeader } from "../Pagination/PaginationHeader";
export interface TagSearchRequest extends PaginationHeader {
    name: string | null;
}
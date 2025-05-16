import { PaginationParams } from "../Pagination/PaginationParams";

export interface PhotoSearchRequest{
    username: string | null;
    title: string | null;
    orientation: string | null;
    size: string | null;
    isUserIncluded: boolean | null;
    sorting: string | null;
    isLiked: boolean | null;
    isSaved: boolean | null;
    pageNumber: number;
    pageSize: number;
}
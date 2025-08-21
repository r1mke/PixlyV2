export interface UserSearchRequest {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    email: string | null;
    pageNumber: number;
    pageSize: number;
}
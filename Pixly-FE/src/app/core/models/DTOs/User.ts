export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    state: string | null;
    isDeleted: boolean | null;
}
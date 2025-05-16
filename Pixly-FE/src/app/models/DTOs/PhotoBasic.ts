import { User } from "./User";

export interface PhotoBasic {
    title: string;
    url: string;
    slug: string;
    user: User | null;
    state: string | null;
    orientation: string;
}
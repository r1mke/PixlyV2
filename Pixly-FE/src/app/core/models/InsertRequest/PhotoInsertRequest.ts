import { List } from "lodash";

export interface PhotoInsertRequest {
    title: string;
    description: string | null;
    userId: string;
    file: File;
    price: number;
    tags: Array<string>;
    isDraft: boolean | null;
}
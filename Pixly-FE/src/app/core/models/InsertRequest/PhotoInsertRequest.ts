import { List } from "lodash";

export interface PhotoInsertRequest {
    title: string;
    description: string | null;
    userId: string;
    file: File;
    tagIds: Array<number>;
    isDraft: boolean | null;
}
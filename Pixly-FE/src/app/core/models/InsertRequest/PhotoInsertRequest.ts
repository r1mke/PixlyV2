export interface PhotoInsertRequest {
    title: string;
    description: string | null;
    userId: number;
    file: File;
    tagIds: number[];
    isDraft: boolean | null;
}
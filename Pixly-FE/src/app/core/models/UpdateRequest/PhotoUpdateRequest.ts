export interface PhotoUpdateRequest {
    title: string;
    description: string | null;
    tagIds: number[];
}
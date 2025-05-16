import { Tag } from "./Tag";

export interface PhotoTag {
    photoId: number;
    tagId: number;
    tag: Tag;
}
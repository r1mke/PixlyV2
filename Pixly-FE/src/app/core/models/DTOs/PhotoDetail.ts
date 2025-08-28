import { PhotoTag } from "./PhotoTag";
import { User } from "./User";

export interface PhotoDetail {
    photoId: number;
    title: string;
    description: string | null;
    url: string;
    slug: string;
    width: number;
    height: number;
    fileSize: number;
    format: string;
    uploadedAt: string;
    userId: string;
    user: User | null;
    state: string | null;
    viewCount: number;
    likeCount: number;
    downloadCount: number;
    orientation: string;
    photoTags: PhotoTag[];
    isCurrentUserLiked: boolean; 
    isCurrentUserSaved: boolean;
    price: number | null;
}
import { User } from "./User";

export interface PhotoDetail {
    title: string;
    description: string | null;
    url: string;
    slug: string;
    width: number;
    height: number;
    fileSize: number;
    format: string;
    uploadedAt: string;
    userId: number;
    user: User | null;
    state: string | null;
    viewCount: number;
    likeCount: number;
    downloadCount: number;
    orientation: string;
}
import { List } from "lodash";
import { DailyUploadedPhotos } from "./DailyUploadedPhotos";
export interface DashboardOverview {
    totalUsers: number;
    totalPhotos: number;
    pendingPhotos: number;
    totalLikes: number;
    totalDownload: number;
    lastFewDayInfo : DailyUploadedPhotos[] ;
}
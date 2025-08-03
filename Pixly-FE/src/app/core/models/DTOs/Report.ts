import { PhotoBasic } from './PhotoBasic';
import { User } from './User';
import { ReportType } from './ReportType';
import { ReportStatus } from './ReportStatus';
export interface Report {
    reportedByUser: User;
    reportedUser: User;
    photo: PhotoBasic;
    reportTitle: string;
    reportMessage: string;
    createdAt: string;
    reportType: ReportType
    reportStatus: ReportStatus
}
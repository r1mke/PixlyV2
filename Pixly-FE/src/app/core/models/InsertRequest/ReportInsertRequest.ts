export interface ReportInsertRequest {
    reportTypeId: number;
    reportMessage: string;
    reportTitle: string;
    reportedUserId: string;
    photoId: number;
    reportedByUserId: string;
}
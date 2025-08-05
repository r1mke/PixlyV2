export interface ReportUpdateRequest {
    reportStatusId: number;
    adminNotes?: string;
    adminUserId: string;
    resolvedAt?: string;
    isDeleted?: boolean;
}
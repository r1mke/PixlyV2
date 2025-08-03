export interface ReportSearchRequest {
    reportTitle?: string;
    isUserIncluded: boolean;
    isPhotoIncluded: boolean;
    pageSize: number;
    pageNumber: number;
}
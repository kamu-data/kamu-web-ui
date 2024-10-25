import { HttpHeaders } from "@angular/common/http";

export interface UploadPrepareResponse {
    uploadToken: string;
    uploadUrl: string;
    method: UploadAvailableMethod;
    useMultipart: boolean;
    headers: [string, string][];
    fields: [string, string][];
}

export interface UploadPrepareData {
    uploadPrepareResponse: UploadPrepareResponse;
    bodyObject: FormData | File;
    uploadHeaders: HttpHeaders;
}

export type UploadAvailableMethod = "POST" | "PUT";

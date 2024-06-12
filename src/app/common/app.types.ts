import { HttpHeaders } from "@angular/common/http";

export type MaybeNull<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type MaybeNullOrUndefined<T> = T | null | undefined;

export interface UploadPrepareResponse {
    uploadToken: string;
    uploadUrl: string;
    method: UploadAvailableMethod;
    useMultipart: boolean;
    headers: [string, string][];
    fields: [string, string][];
}

export interface UploadPerareData {
    uploadPrepareResponse: UploadPrepareResponse;
    bodyObject: FormData | File;
    uploadHeaders: HttpHeaders;
}

export type UploadAvailableMethod = "POST" | "PUT";

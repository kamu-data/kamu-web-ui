/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { UploadPrepareResponse } from "@interface/ingest-via-file-upload.types";

export const mockUploadPrepareResponse: UploadPrepareResponse = {
    fields: [["1", "2"]],
    headers: [["auth", "Bearer mockToken"]],
    method: "POST",
    uploadToken: "",
    uploadUrl: "",
    useMultipart: true,
};

export const mockFile = new File(["id,name\n1,a\n"], "data.csv", { type: "text/csv" });

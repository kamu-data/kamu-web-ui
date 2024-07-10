import { UploadPrepareResponse } from "src/app/common/ingest-via-file-upload.types";

export const mockUploadPrepareResponse: UploadPrepareResponse = {
    fields: [["1", "2"]],
    headers: [["auth", "Bearer mockToken"]],
    method: "POST",
    uploadToken: "",
    uploadUrl: "",
    useMultipart: true,
};

export const mockFile = {
    name: "data.csv",
    size: 12,
    type: "text/csv",
} as File;

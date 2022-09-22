export class ErrorTexts {
    public static readonly ERROR_TITLE_REQUEST_FAILED = "Request failed.";
    public static readonly ERROR_NETWORK_DESCRIPTION =
        "Check the Internet connection.";
    public static readonly ERROR_DATASET_NOT_FOUND = "dataset not found.";
    public static readonly ERROR_BAD_SQL_QUERY = "Incorrect SQL query.";
    public static readonly ERROR_SERVER_BAD_SQL_QUERY = "DataFusion error";
    public static readonly ERROR_TECHNICAL_SUPPORT =
        "Operation failed. If this happens again, please contact Kamu technical support.";
}

export const DictionaryErrors = [
    ErrorTexts.ERROR_DATASET_NOT_FOUND,
    ErrorTexts.ERROR_BAD_SQL_QUERY,
];

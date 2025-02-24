import { Injectable } from "@angular/core";

@Injectable()
export default class ProjectLinks {
    public static readonly URL_GITHUB_CALLBACK: string = "github_callback";
    public static readonly URL_BLOCK: string = "block";
    public static readonly URL_FLOW_DETAILS: string = "flow-details";

    // initial routes
    public static readonly URL_HOME: string = "/";
    public static readonly URL_LOGIN: string = "v/login";
    public static readonly URL_SEARCH: string = "v/search";
    public static readonly URL_DATASET_CREATE: string = "v/new-dataset";
    public static readonly URL_PAGE_NOT_FOUND: string = "v/page-not-found";
    public static readonly URL_RETURN_TO_CLI: string = "v/return-to-cli";
    public static readonly URL_SETTINGS: string = "v/settings";
    public static readonly URL_ADMIN_DASHBOARD: string = "v/admin-dashboard";
    public static readonly URL_QUERY_EXPLAINER: string = "v/query-explainer";
    public static readonly URL_QUERY: string = "v/query";

    public static readonly ALL_URLS: string[] = [
        ProjectLinks.URL_HOME,
        ProjectLinks.URL_LOGIN,
        ProjectLinks.URL_GITHUB_CALLBACK,
        ProjectLinks.URL_BLOCK,
        ProjectLinks.URL_SEARCH,
        ProjectLinks.URL_DATASET_CREATE,
        ProjectLinks.URL_PAGE_NOT_FOUND,
        ProjectLinks.URL_RETURN_TO_CLI,
        ProjectLinks.URL_SETTINGS,
    ];

    public static readonly DEFAULT_URL = ProjectLinks.URL_SEARCH;

    public static readonly URL_PARAM_ACCOUNT_NAME: string = "accountName";
    public static readonly URL_PARAM_DATASET_NAME: string = "datasetName";
    public static readonly URL_PARAM_CATEGORY: string = "category";
    public static readonly URL_PARAM_BLOCK_HASH: string = "blockHash";
    public static readonly URL_PARAM_ADD_POLLING_SOURCE: string = "add-polling-source";
    public static readonly URL_PARAM_SET_TRANSFORM: string = "set-transform";
    public static readonly URL_PARAM_ADD_PUSH_SOURCE: string = "add-push-source";
    public static readonly URL_PARAM_FLOW_ID: string = "flow-id";

    public static readonly URL_QUERY_PARAM_TAB: string = "tab";
    public static readonly URL_QUERY_PARAM_PAGE: string = "page";
    public static readonly URL_QUERY_PARAM_QUERY: string = "query";
    public static readonly URL_QUERY_PARAM_CALLBACK_URL: string = "callbackUrl";
    public static readonly URL_QUERY_PARAM_PUSH_SOURCE_NAME: string = "name";
    public static readonly URL_QUERY_PARAM_SECTION: string = "section";
    public static readonly URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN: string = "commitmentUploadToken";
    public static readonly URL_QUERY_PARAM_SQL_QUERY: string = "sqlQuery";
    public static readonly URL_QUERY_PARAM_REDIRECT_URL: string = "redirectUrl";
    public static readonly URL_QUERY_PARAM_CODE: string = "code";
}

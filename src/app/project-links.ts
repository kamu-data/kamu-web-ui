import { Injectable } from "@angular/core";

@Injectable()
export default class ProjectLinks {
    public static readonly URL_HOME: string = "/";
    public static readonly URL_PROFILE: string = "v/profile";
    public static readonly URL_LOGIN: string = "v/login";
    public static readonly URL_GITHUB_CALLBACK: string = "github_callback";
    public static readonly URL_SEARCH: string = "v/search";
    public static readonly URL_DATASET_CREATE: string = "v/new-dataset";
    public static readonly URL_PAGE_NOT_FOUND: string = "v/page-not-found";

    public static readonly ALL_URLS: string[] = [
        ProjectLinks.URL_HOME,
        ProjectLinks.URL_PROFILE,
        ProjectLinks.URL_LOGIN,
        ProjectLinks.URL_GITHUB_CALLBACK,
        ProjectLinks.URL_SEARCH,
        ProjectLinks.URL_DATASET_CREATE,
        ProjectLinks.URL_PAGE_NOT_FOUND
    ];

    public static readonly URL_PARAM_ACCOUNT_NAME: string = "accountName";
    public static readonly URL_PARAM_DATASET_NAME: string = "datasetName";

    public static readonly URL_QUERY_PARAM_TAB: string = "tab";
    public static readonly URL_QUERY_PARAM_PAGE: string = "page";
    public static readonly URL_QUERY_PARAM_QUERY: string = "query";
    

    // TODO
    // public static readonly URL_DATASET_CREATE_SELECT_TYPE = "select-type";
    // public static readonly URL_DATASET_CREATE_ROOT = "root";
}

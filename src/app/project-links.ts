import { Injectable } from "@angular/core";

@Injectable()
export default class ProjectLinks {
    public static urlHome = "/";
    public static urlProfile = "v/profile";
    public static urlLogin = "v/login";
    public static urlGithubCallback = "github_callback";
    public static urlSearch = "v/search";
    public static urlDatasetCreate = "v/new-dataset";
    public static urlPageNotFound = "v/page-not-found";

    public static urlParamAccountName = "accountName";
    public static urlParamDatasetName = "datasetName";

    public static urlQueryParamTab = "tab";
    public static urlQueryParamPage = "page";
    public static urlQueryParamQuery = "query";

    // TODO
    // public static urlDatasetCreateSelectType = "select-type";
    // public static urlDatasetCreateRoot = "root";
}

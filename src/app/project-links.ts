import { Injectable } from "@angular/core";

@Injectable()
export default class ProjectLinks {
    public static urlHome = "/";
    public static urlProfile = "profile";
    public static urlLogin = "v/login";
    public static urlGithubCallback = "github_callback";
    public static urlSearch = "v/search";
    //  public static urlDatasetView = "dataset-view";
    public static urlDatasetViewOverviewType = "overview";
    public static urlDatasetViewMetadataType = "metadata";
    public static urlDatasetViewDataType = "data";
    public static urlDatasetViewHistoryType = "history";
    public static urlDatasetViewLineageType = "lineage";
    public static urlDatasetCreate = "v/new-dataset";
    // public static urlDatasetCreateSelectType = "select-type";
    // public static urlDatasetCreateRoot = "root";
}

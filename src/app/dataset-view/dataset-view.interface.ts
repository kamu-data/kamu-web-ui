import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { OverviewUpdate } from "./dataset.subscriptions.interface";

export enum DatasetViewTypeEnum {
    Overview = "overview",
    Data = "data",
    Metadata = "metadata",
    Lineage = "lineage",
    Discussions = "discussions",
    History = "history",
    Settings = "settings",
    Flows = "flows",
}

export interface DatasetOverviewTabData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
    overviewUpdate: OverviewUpdate;
}

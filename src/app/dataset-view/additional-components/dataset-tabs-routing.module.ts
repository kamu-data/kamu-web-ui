import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview-component/overview.component";
import { DataComponent } from "./data-component/data.component";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { MetadataComponent } from "./metadata-component/metadata.component";
import { HistoryComponent } from "./history-component/history.component";
import { LineageComponent } from "./lineage-component/lineage.component";
import { FlowsComponent } from "./flows-component/flows.component";

const routes: Routes = [
    {
        path: "",
        component: OverviewComponent,
        data: { tab: DatasetViewTypeEnum.Overview },
    },
    {
        path: "data",
        component: DataComponent,
        loadChildren: () => import("./data-component/data-tab.module").then((m) => m.DataTabModule),
        data: { tab: DatasetViewTypeEnum.Data },
    },
    {
        path: "metadata",
        component: MetadataComponent,
        data: { tab: DatasetViewTypeEnum.Metadata },
    },
    {
        path: "history",
        component: HistoryComponent,
        data: { tab: DatasetViewTypeEnum.History },
    },
    {
        path: "lineage",
        component: LineageComponent,
        data: { tab: DatasetViewTypeEnum.Lineage },
    },
    {
        path: "flows",
        component: FlowsComponent,
        data: { tab: DatasetViewTypeEnum.Flows },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DatasetTabsRoutingModule {}

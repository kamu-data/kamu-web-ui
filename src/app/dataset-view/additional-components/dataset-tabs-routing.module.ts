import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview-component/overview.component";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { MetadataComponent } from "./metadata-component/metadata.component";
import { FlowsComponent } from "./flows-component/flows.component";

const routes: Routes = [
    {
        path: "",
        component: OverviewComponent,
        data: { tab: DatasetViewTypeEnum.Overview },
    },
    {
        path: "data",
        loadChildren: () => import("./data-tab/data-tab.module").then((m) => m.DataTabModule),
        data: { tab: DatasetViewTypeEnum.Data },
    },
    {
        path: "metadata",
        component: MetadataComponent,
        data: { tab: DatasetViewTypeEnum.Metadata },
    },
    {
        path: "history",
        loadChildren: () => import("./history-tab/history-tab.module").then((m) => m.HistoryTabModule),
        data: { tab: DatasetViewTypeEnum.History },
    },
    {
        path: "lineage",
        loadChildren: () => import("./lineage-tab/lineage-tab.module").then((m) => m.LineageTabModule),
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

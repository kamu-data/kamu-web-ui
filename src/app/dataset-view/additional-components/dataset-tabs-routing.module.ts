import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview-component/overview.component";
import { DataComponent } from "./data-component/data.component";
import { DatasetViewTypeEnum } from "../dataset-view.interface";

const routes: Routes = [
    {
        path: "",
        component: OverviewComponent,
        data: { tab: DatasetViewTypeEnum.Overview },
    },
    {
        path: "data",
        component: DataComponent,
        data: { tab: DatasetViewTypeEnum.Data },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DatasetTabsRoutingModule {}

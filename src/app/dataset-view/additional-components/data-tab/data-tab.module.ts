import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataComponent } from "./data-component/data.component";
import { QuerySharedModule } from "src/app/query/shared/query-shared/query-shared.module";
import { DataTabRoutingModule } from "./data-tab-routing.module";

@NgModule({
    declarations: [DataComponent],
    imports: [CommonModule, QuerySharedModule, DataTabRoutingModule],
})
export class DataTabModule {}

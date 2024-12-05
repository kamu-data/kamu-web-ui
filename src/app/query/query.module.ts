import { CommonModule } from "@angular/common";
import { GlobalQueryComponent } from "./global-query/global-query.component";
import { QuerySharedModule } from "./shared/query-shared/query-shared.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared/shared.module";

@NgModule({
    declarations: [GlobalQueryComponent],
    imports: [QuerySharedModule, CommonModule, SharedModule],
})
export class QueryModule {}

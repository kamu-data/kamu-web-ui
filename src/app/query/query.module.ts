import { CommonModule } from "@angular/common";
import { GlobalQueryComponent } from "./global-query/global-query.component";
import { QuerySharedModule } from "./shared/query-shared/query-shared.module";
import { NgModule } from "@angular/core";

@NgModule({
    declarations: [GlobalQueryComponent],
    imports: [QuerySharedModule, CommonModule],
})
export class QueryModule {}

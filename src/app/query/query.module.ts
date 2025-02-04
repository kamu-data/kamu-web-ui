import { CommonModule } from "@angular/common";
import { GlobalQueryComponent } from "./global-query/global-query.component";
import { QuerySharedModule } from "./shared/query-shared.module";
import { NgModule } from "@angular/core";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";

@NgModule({
    declarations: [GlobalQueryComponent],
    imports: [QuerySharedModule, CommonModule, FeatureFlagModule],
})
export class QueryModule {}

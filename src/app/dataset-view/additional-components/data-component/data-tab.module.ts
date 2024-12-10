import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataComponent } from "./data.component";
import { QuerySharedModule } from "src/app/query/shared/query-shared/query-shared.module";

@NgModule({
    declarations: [DataComponent],
    imports: [CommonModule, QuerySharedModule],
})
export class DataTabModule {}

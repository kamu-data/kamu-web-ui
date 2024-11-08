import { DatasetModule } from "./../dataset-view/dataset.module";
import { EditorModule } from "./../shared/editor/editor.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GlobalQueryComponent } from "./global-query/global-query.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";

@NgModule({
    declarations: [GlobalQueryComponent],
    imports: [
        CommonModule,
        MatProgressBarModule,
        DynamicTableModule,
        EditorModule,
        MatDividerModule,
        MatMenuModule,
        DatasetModule,
    ],
})
export class QueryModule {}

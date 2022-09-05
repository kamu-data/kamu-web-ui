import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetListComponent } from "./dataset-list.component";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    imports: [
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        NgbModule,
        CommonModule,
        FormsModule,
        MatChipsModule,
        MatSelectModule,
    ],
    exports: [DatasetListComponent],
    declarations: [DatasetListComponent],
})
export class DatasetListModule {
    public static forRoot(): ModuleWithProviders<DatasetListModule> {
        return { ngModule: DatasetListModule };
    }
}

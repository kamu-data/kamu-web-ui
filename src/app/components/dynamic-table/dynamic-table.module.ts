import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { DynamicTableComponent } from "./dynamic-table.component";

@NgModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTableModule,
        MatSidenavModule,
        NgbModule,
        CommonModule,
        FormsModule,
    ],
    exports: [DynamicTableComponent],
    declarations: [DynamicTableComponent],
})
export class DynamicTableModule {
    public static forRoot(): ModuleWithProviders<DynamicTableModule> {
        return { ngModule: DynamicTableModule };
    }
}

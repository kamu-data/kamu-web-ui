import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatDividerModule } from "@angular/material/divider";
import { CustomPaginationComponent } from "./custom-pagination.component";

@NgModule({
    imports: [MatIconModule, MatButtonModule, MatDividerModule, NgbModule, CommonModule, FormsModule, MatChipsModule],
    exports: [CustomPaginationComponent],
    declarations: [CustomPaginationComponent],
})
export class CustomPaginationModule {
    public static forRoot(): ModuleWithProviders<CustomPaginationModule> {
        return { ngModule: CustomPaginationModule };
    }
}

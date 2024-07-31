import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatDividerModule } from "@angular/material/divider";
import { PaginationComponent } from "./pagination.component";

@NgModule({
    imports: [MatIconModule, MatButtonModule, MatDividerModule, NgbModule, CommonModule, FormsModule, MatChipsModule],
    exports: [PaginationComponent],
    declarations: [PaginationComponent],
})
export class PaginationModule {
    public static forRoot(): ModuleWithProviders<PaginationModule> {
        return { ngModule: PaginationModule };
    }
}

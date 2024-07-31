import { NgModule } from "@angular/core";
import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";
import { AngularSvgIconModule } from "angular-svg-icon";

@NgModule({
    imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule, NgbPopoverModule, AngularSvgIconModule],
    exports: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
    declarations: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
})
export class SearchAdditionalButtonsModule {}

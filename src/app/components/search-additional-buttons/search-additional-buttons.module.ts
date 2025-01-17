import { NgModule } from "@angular/core";
import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";
import { SharedModule } from "src/app/shared/shared/shared.module";

@NgModule({
    imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule, NgbPopoverModule, SharedModule],
    exports: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
    declarations: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
})
export class SearchAdditionalButtonsModule {}

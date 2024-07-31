import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchSidenavComponent } from "./search-sidenav.component";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatSidenavModule,
        NgbModule,
        FormsModule,
        NgbNavModule,
    ],
    exports: [SearchSidenavComponent],
    declarations: [SearchSidenavComponent],
})
export class SearchSidenavModule {
    public static forRoot(): ModuleWithProviders<SearchSidenavModule> {
        return { ngModule: SearchSidenavModule };
    }
}

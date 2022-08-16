import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { SideNavComponent } from "./side-nav.component";

@NgModule({
    imports: [NgbModule, CommonModule, FormsModule],
    exports: [SideNavComponent],
    declarations: [SideNavComponent],
})
export class SideNavModule {
    public static forRoot(): ModuleWithProviders<SideNavModule> {
        return { ngModule: SideNavModule };
    }
}

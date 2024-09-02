import { ClipboardModule } from "@angular/cdk/clipboard";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DisplayHashComponent } from "./display-hash.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [DisplayHashComponent],
    exports: [DisplayHashComponent],
    imports: [CommonModule, AngularSvgIconModule, ClipboardModule, RouterModule],
})
export class DisplayHashModule {}

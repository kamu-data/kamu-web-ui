import { ClipboardModule } from "@angular/cdk/clipboard";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DisplayHashComponent } from "./display-hash.component";
import { AngularSvgIconModule } from "angular-svg-icon";

@NgModule({
    declarations: [DisplayHashComponent],
    exports: [DisplayHashComponent],
    imports: [CommonModule, AngularSvgIconModule, ClipboardModule],
})
export class DisplayHashModule {}

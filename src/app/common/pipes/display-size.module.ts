import { DisplaySizePipe } from "./display-size.pipe";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [DisplaySizePipe],
    exports: [DisplaySizePipe],
    imports: [CommonModule],
})
export class DisplaySizeModule {}

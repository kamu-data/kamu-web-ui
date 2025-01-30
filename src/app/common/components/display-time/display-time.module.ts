import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DisplayTimeComponent } from "./display-time.component";

@NgModule({
    declarations: [DisplayTimeComponent],
    exports: [DisplayTimeComponent],
    imports: [CommonModule],
})
export class DisplayTimeModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafeHtmlPipe } from "./safe-html.pipe";

@NgModule({
    declarations: [SafeHtmlPipe],
    exports: [SafeHtmlPipe],
    imports: [CommonModule],
})
export class SafeHtmlModule {}

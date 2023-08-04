import { ModuleWithProviders, NgModule } from "@angular/core";
import { ModalService } from "./modal.service";
import { ModalComponent } from "./modal.component";
import { ModalDialogComponent } from "./modal-dialog.component";
import { CommonModule } from "@angular/common";
import { ModalImageComponent } from "./modal-image.component";
import { ModalSpinnerComponent } from "./modal-spinner.component";

@NgModule({
    imports: [CommonModule],
    declarations: [ModalComponent, ModalDialogComponent, ModalImageComponent, ModalSpinnerComponent],
    exports: [ModalComponent],
})
export class ModalModule {
    static forRoot(): ModuleWithProviders<ModalModule> {
        return {
            ngModule: ModalModule,
            providers: [ModalService],
        };
    }
}

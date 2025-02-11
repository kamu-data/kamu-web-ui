import { Component, inject } from "@angular/core";
import { ModalService } from "../../common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import AppValues from "src/app/common/values/app.values";

@Component({
    selector: "app-notification-indicator",
    templateUrl: "./notification-indicator.html",
    styleUrls: ["./notification-indicator.scss"],
})
export class NotificationIndicatorComponent {
    private modalService = inject(ModalService);

    public onNotifications(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }
}

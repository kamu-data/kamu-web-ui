import { ModalService } from "../components/modal/modal.service";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import { NavigationService } from "../services/navigation.service";
import { promiseWithCatch } from "./app.helpers";
import { BaseComponent } from "./base.component";
import { inject } from "@angular/core";

export abstract class BaseProcessingComponent extends BaseComponent {
    protected navigationService = inject(NavigationService);
    protected modalService = inject(ModalService);

    public showOwnerPage(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public onClickSearchAdditionalButton(method: string) {
        const mapperMethod: {
            [key in searchAdditionalButtonsEnum]: () => void;
        } = {
            [searchAdditionalButtonsEnum.DeriveFrom]: () => this.onClickDeriveFrom(),

            [searchAdditionalButtonsEnum.Starred]: () => null,
            [searchAdditionalButtonsEnum.UnWatch]: () => null,
        };
        mapperMethod[method as searchAdditionalButtonsEnum]();

        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    private onClickDeriveFrom(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }
}

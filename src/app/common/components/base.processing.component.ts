/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "./base.component";
import { inject } from "@angular/core";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { searchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { promiseWithCatch } from "../helpers/app.helpers";

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
            [searchAdditionalButtonsEnum.DeriveFrom]: () => null,

            [searchAdditionalButtonsEnum.Starred]: () => this.onClickUnimplemetedButton(),
            [searchAdditionalButtonsEnum.UnWatch]: () => this.onClickUnimplemetedButton(),
        };
        mapperMethod[method as searchAdditionalButtonsEnum]();
    }

    private onClickUnimplemetedButton(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";

import { ModalService } from "src/app/common/components/modal/modal.service";
import { NavigationService } from "src/app/services/navigation.service";

import { BaseComponent } from "./base.component";

export abstract class BaseProcessingComponent extends BaseComponent {
    protected navigationService = inject(NavigationService);
    protected modalService = inject(ModalService);

    public showOwnerPage(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { Observable } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { DatasetBasicsFragment, DatasetEndpoints } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { DataAccessModalComponent } from "src/app/data-access-panel/data-access-modal/data-access-modal.component";

import { NavigationService } from "../services/navigation.service";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass,
        //-----//
        MatIconModule,
        //-----//
        FeatureFlagDirective,
    ],
})
export class DataAccessPanelComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public isUserLogged: boolean;
    public protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;

    private ngbModalService = inject(NgbModal);
    private navigationService = inject(NavigationService);
    private router = inject(Router);

    public openDataAccessModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(DataAccessModalComponent, {
            size: "lg",
            centered: true,
        });
        const modalRefInstance = modalRef.componentInstance as DataAccessModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public onClickGetData(): void {
        if (this.isUserLogged) {
            this.openDataAccessModal();
        } else {
            const redirectUrl = this.router.url;
            this.navigationService.navigateToLogin(redirectUrl);
        }
    }
}

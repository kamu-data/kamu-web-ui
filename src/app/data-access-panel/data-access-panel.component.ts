/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { Observable } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { DatasetBasicsFragment, DatasetEndpoints } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { DataAccessModalComponent } from "src/app/data-access-panel/data-access-modal/data-access-modal.component";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
        //-----//
        FeatureFlagDirective,
    ],
})
export class DataAccessPanelComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;

    private ngbModalService = inject(NgbModal);

    public openDataAccessModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(DataAccessModalComponent, {
            size: "lg",
            centered: true,
        });
        const modalRefInstance = modalRef.componentInstance as DataAccessModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }
}

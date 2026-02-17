/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectorRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { combineLatest } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment, DatasetKind, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";

export abstract class BaseMainEventComponent extends BaseComponent {
    protected modalService = inject(NgbModal);
    protected datasetCommitService = inject(DatasetCommitService);
    protected cdr = inject(ChangeDetectorRef);
    protected yamlEventService = inject(TemplatesYamlEventsService);
    protected datasetService = inject(DatasetService);
    protected datasetSubsService = inject(DatasetSubscriptionsService);
    protected navigationServices = inject(NavigationService);
    protected loggedUserService = inject(LoggedUserService);

    public errorMessage = "";
    public changedEventYamlByHash: MaybeNull<string> = null;

    protected subscribeErrorMessage(): void {
        this.datasetCommitService.commitEventErrorOccurrences
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((message: string) => {
                this.errorMessage = message;
                this.cdr.detectChanges();
            });
    }

    protected checkDatasetEditability(expectedKind: DatasetKind): void {
        const datasetInfo: DatasetInfo = this.getDatasetInfoFromUrl();

        this.datasetService.requestDatasetBasicDataWithPermissions(datasetInfo).subscribe();

        combineLatest([this.datasetSubsService.permissionsChanges, this.datasetService.datasetChanges])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(([datasetPermissions, datasetBasics]: [DatasetPermissionsFragment, DatasetBasicsFragment]) => {
                if (!datasetPermissions.permissions.metadata.canCommit || datasetBasics.kind !== expectedKind) {
                    this.navigationServices.navigateToDatasetView({
                        accountName: datasetBasics.owner.accountName,
                        datasetName: datasetBasics.name,
                        tab: DatasetViewTypeEnum.Overview,
                    });
                }
            });
    }

    protected abstract onEditYaml(): void;
    protected abstract onSaveEvent(): void;
}

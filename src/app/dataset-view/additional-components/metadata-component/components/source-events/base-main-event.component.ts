/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectorRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { MaybeNull } from "@interface/app.types";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

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

    protected abstract onEditYaml(): void;
    protected abstract onSaveEvent(): void;
}

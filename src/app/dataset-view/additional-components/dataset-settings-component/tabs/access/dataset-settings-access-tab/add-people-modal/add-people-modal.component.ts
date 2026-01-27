/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { NgbActiveModal, NgbTypeaheadSelectItemEvent, NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, tap, finalize, switchMap } from "rxjs";
import { DatasetAccessRole, DatasetBasicsFragment, NameLookupResult } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetCollaborationsService } from "../dataset-collaborations.service";
import { CollaboratorModalResultType, ROLE_OPTIONS } from "./add-people-modal.model";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgIf, NgFor } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-add-people-modal",
    templateUrl: "./add-people-modal.component.html",
    styleUrls: ["./add-people-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        NgFor,
        //-----//
        MatDividerModule,
        MatProgressSpinnerModule,
        MatIconModule,
        NgbTypeahead,
    ]
})
export class AddPeopleModalComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public activeCollaboratorsIds: string[] = [];
    public role: MaybeNull<DatasetAccessRole> = null;
    public searchPerson: string = "";
    public selectedCollaborator: MaybeNull<NameLookupResult>;
    public searching: boolean = false;

    public readonly DatasetAccessRole: typeof DatasetAccessRole = DatasetAccessRole;
    public readonly SELECT_ROLE_OPTIONS = ROLE_OPTIONS;
    private readonly DEFAULT_PER_PAGE = 10;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    public activeModal = inject(NgbActiveModal);
    private cdr = inject(ChangeDetectorRef);
    private datasetCollaborationsService = inject(DatasetCollaborationsService);

    public search: OperatorFunction<string, readonly NameLookupResult[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(AppValues.SHORT_DELAY_MS),
            distinctUntilChanged(),
            tap(() => (this.searching = true)),
            switchMap((term: string) =>
                this.datasetCollaborationsService
                    .searchCollaborator({
                        query: term,
                        filters: {
                            byAccount: {
                                excludeAccountsByIds: this.activeCollaboratorsIds,
                            },
                        },
                        page: 0,
                        perPage: this.DEFAULT_PER_PAGE,
                    })
                    .pipe(
                        finalize(() => {
                            this.searching = false;
                            this.cdr.detectChanges();
                        }),
                    ),
            ),
        );

    public formatter(x: NameLookupResult | string): string {
        return typeof x !== "string" ? x.accountName : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        const account = event.item as NameLookupResult;
        this.selectedCollaborator = account;
        this.searchPerson = "";
    }

    public closeSelectedMember(): void {
        this.selectedCollaborator = null;
        this.searchPerson = "";
    }

    public saveChanges(): void {
        if (this.selectedCollaborator?.id) {
            const result: CollaboratorModalResultType = {
                role: this.role as DatasetAccessRole,
                accountId: this.selectedCollaborator.id,
            };
            this.activeModal.close(result);
        }
    }
}

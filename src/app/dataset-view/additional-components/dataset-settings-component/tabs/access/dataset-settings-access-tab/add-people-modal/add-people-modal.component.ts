/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, tap, finalize, switchMap } from "rxjs";
import {
    AccountWithRole,
    DatasetAccessRole,
    DatasetBasicsFragment,
    NameLookupResult,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetCollaborationsService } from "../dataset-collaborations.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Component({
    selector: "app-add-people-modal",
    templateUrl: "./add-people-modal.component.html",
    styleUrls: ["./add-people-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPeopleModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public collaborator: MaybeNull<AccountWithRole>;
    @Input({ required: true }) public currentPage: number;
    @Input({ required: true }) public activeCollaboratorsIds: string[] = [];
    public role: MaybeNull<DatasetAccessRole> = null;
    public searchPerson: string = "";
    public selectedCollaborator: MaybeNull<NameLookupResult>;
    public searching: boolean = false;

    public readonly DatasetAccessRole: typeof DatasetAccessRole = DatasetAccessRole;
    private readonly DEFAULT_PER_PAGE = 10;

    public activeModal = inject(NgbActiveModal);
    private cdr = inject(ChangeDetectorRef);
    private datasetCollaborationsService = inject(DatasetCollaborationsService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.initState();
    }
    private initState(): void {
        if (this.collaborator) {
            this.role = this.collaborator.role;
        }
        // this.datasetCollaborationsService
        //     .listCollaborators({ datasetId: this.datasetBasics.id })
        //     .pipe(takeUntilDestroyed(this.destroyRef))
        //     .subscribe((result: AccountWithRoleConnection) => {
        //         this.activeCollaboratorsIds = result.nodes.map((node) => node.account.id);
        //     });
    }

    public search: OperatorFunction<string, readonly NameLookupResult[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(AppValues.SHORT_DELAY_MS),
            distinctUntilChanged(),
            tap(() => (this.searching = true)),
            switchMap((term: string) =>
                this.datasetCollaborationsService.searchCollaborator({
                    query: term,
                    filters: {
                        byAccount: {
                            excludeAccountsByIds: [
                                ...this.activeCollaboratorsIds,
                                this.loggedUserService.currentlyLoggedInUser.id,
                            ],
                        },
                    },
                    page: 0,
                    perPage: this.DEFAULT_PER_PAGE,
                }),
            ),
            tap(() => {
                this.searching = false;
                this.cdr.detectChanges();
            }),
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
        this.datasetCollaborationsService
            .setRoleCollaborator({
                datasetId: this.datasetBasics.id,
                accountId: this.selectedCollaborator
                    ? this.selectedCollaborator.id
                    : (this.collaborator?.account.id as string),
                role: this.role as DatasetAccessRole,
            })
            .pipe(
                finalize(() => {
                    this.activeModal.close("Success");
                }),
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}

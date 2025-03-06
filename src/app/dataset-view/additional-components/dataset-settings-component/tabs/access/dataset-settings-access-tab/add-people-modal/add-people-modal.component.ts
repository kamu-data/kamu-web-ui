/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, map, tap, delay } from "rxjs";
import { AccountWithEmailFragment, DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { MaybeNull } from "src/app/interface/app.types";

const states: AccountWithEmailFragment[] = [
    {
        id: "0",
        accountName: "Bill-John",
        displayName: "BILL_JOHN",
        avatarUrl: AppValues.DEFAULT_AVATAR_URL,
        email: "",
    },
    {
        id: "1",
        accountName: "John-Weak",
        displayName: "JOHN_WEAK",
        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
        email: "",
    },
];

@Component({
    selector: "app-add-people-modal",
    templateUrl: "./add-people-modal.component.html",
    styleUrls: ["./add-people-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPeopleModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public member: MaybeNull<unknown>;
    public role: string = "";
    public searchMember: string = "";
    public selectedMember: MaybeNull<AccountWithEmailFragment>;
    public searching: boolean = false;

    public activeModal = inject(NgbActiveModal);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.initState();
    }
    private initState(): void {
        if (this.member) this.role = "Reader";
    }

    public search: OperatorFunction<string, readonly AccountWithEmailFragment[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),

            map((term) =>
                term.length < 2
                    ? []
                    : states
                          .filter(
                              (v: AccountWithEmailFragment) =>
                                  v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1,
                          )
                          .slice(0, 10),
            ),
            tap(() => (this.searching = true)),
            delay(2000),
            tap(() => {
                this.searching = false;
                this.cdr.detectChanges();
            }),
        );

    public formatter(x: AccountWithEmailFragment | string): string {
        return typeof x !== "string" ? x.accountName : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        const account = event.item as AccountWithEmailFragment;
        this.selectedMember = account;
        this.searchMember = account.accountName;
    }

    public closeSelectedMember(): void {
        this.selectedMember = null;
        this.searchMember = "";
    }

    public saveRole(): void {
        // TODO: Implement service
    }
}

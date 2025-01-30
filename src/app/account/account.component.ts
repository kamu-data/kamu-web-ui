import ProjectLinks from "src/app/project-links";
import { BaseComponent } from "src/app/common/components/base.component";
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "./account.constants";
import { ActivatedRoute, Params } from "@angular/router";
import AppValues from "src/app/common/values/app.values";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { AccountService } from "src/app/services/account.service";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import { distinctUntilChanged, map, shareReplay, switchMap } from "rxjs/operators";
import { Observable, combineLatest } from "rxjs";
import { MaybeNull } from "src/app/common/types/app.types";
import { AccountNotFoundError } from "src/app/common/values/errors";
import { AccountPageQueryParams } from "./account.component.model";
import { ModalService } from "../common/components/modal/modal.service";
import { LoggedUserService } from "../auth/logged-user.service";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends BaseComponent implements OnInit {
    public readonly AccountTabs = AccountTabs;
    public isDropdownMenu = false;
    public user$: Observable<AccountFragment>;
    public datasetsAccount$: Observable<DatasetsAccountResponse>;
    public activeTab$: Observable<AccountTabs>;

    @ViewChild("containerMenu") containerMenu: ElementRef;
    @ViewChild("dropdownMenu") dropdownMenu: ElementRef;

    private route = inject(ActivatedRoute);
    private modalService = inject(ModalService);
    private accountService = inject(AccountService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        const accountName$ = this.route.params.pipe(
            map((params: Params) => params[ProjectLinks.URL_PARAM_ACCOUNT_NAME] as string),
        );

        const queryParams$ = this.route.queryParams.pipe(
            map((queryParams: Params) => {
                return {
                    tab: queryParams.tab ? (queryParams.tab as AccountTabs) : undefined,
                    page: queryParams.page ? (queryParams.page as number) : undefined,
                } as AccountPageQueryParams;
            }),
            shareReplay(),
        );

        this.activeTab$ = queryParams$.pipe(
            map((accountPageParams: AccountPageQueryParams) => accountPageParams.tab ?? AccountTabs.DATASETS),
            distinctUntilChanged(),
        );

        this.user$ = this.pipelineAccountByName(accountName$);
        this.datasetsAccount$ = this.pipelineAccountDatasets(this.user$, queryParams$);
    }

    public avatarLink(user: AccountFragment): string {
        return user.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL;
    }

    public isLoggedUser(user: AccountFragment): boolean {
        return this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName === user.accountName;
    }

    public onEditProfile(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onFollow(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    private pipelineAccountByName(accountName$: Observable<string>): Observable<AccountFragment> {
        return accountName$.pipe(
            switchMap((accountName: string) => {
                return this.accountService.fetchAccountByName(accountName);
            }),
            shareReplay(),
            map((account: MaybeNull<AccountFragment>) => {
                if (account) return account;
                throw new AccountNotFoundError();
            }),
        );
    }

    private pipelineAccountDatasets(
        account$: Observable<AccountFragment>,
        queryParams$: Observable<AccountPageQueryParams>,
    ): Observable<DatasetsAccountResponse> {
        const page$ = queryParams$.pipe(map((queryParams: AccountPageQueryParams) => queryParams.page ?? 1));

        return combineLatest([account$, page$]).pipe(
            distinctUntilChanged(),
            switchMap(([account, page]: [AccountFragment, number]) => {
                return this.accountService.getDatasetsByAccountName(account.accountName, page - 1);
            }),
        );
    }
}

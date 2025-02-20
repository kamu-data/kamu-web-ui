import ProjectLinks from "src/app/project-links";
import { ChangeDetectionStrategy, Component, inject, Input, numberAttribute, OnInit } from "@angular/core";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "./account.constants";
import AppValues from "src/app/common/values/app.values";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { AccountService } from "src/app/account/account.service";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import { distinctUntilChanged, map, shareReplay, switchMap } from "rxjs/operators";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { MaybeNull } from "src/app/interface/app.types";
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
export class AccountComponent implements OnInit {
    @Input(ProjectLinks.URL_PARAM_ACCOUNT_NAME) public accountName: string;
    @Input(ProjectLinks.URL_QUERY_PARAM_TAB) public set activeTab(activeTab: AccountTabs) {
        this.activeTab$.next(activeTab ?? AccountTabs.DATASETS);
    }
    @Input({ transform: numberAttribute, alias: ProjectLinks.URL_QUERY_PARAM_PAGE }) public set page(page: number) {
        this.page$.next(page ?? 1);
    }

    public readonly AccountTabs = AccountTabs;
    public isDropdownMenu = false;
    public user$: Observable<AccountFragment>;
    public datasetsAccount$: Observable<DatasetsAccountResponse>;
    public activeTab$: BehaviorSubject<AccountTabs> = new BehaviorSubject<AccountTabs>(AccountTabs.DATASETS);
    public page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    private modalService = inject(ModalService);
    private accountService = inject(AccountService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        const queryParams$ = combineLatest([this.activeTab$.asObservable(), this.page$.asObservable()]).pipe(
            map(([activeTab, page]: [AccountTabs, number]) => {
                return {
                    tab: activeTab,
                    page: page,
                };
            }),
            shareReplay(),
        );

        this.user$ = this.pipelineAccountByName(this.accountName);
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

    private pipelineAccountByName(accountName: string): Observable<AccountFragment> {
        return this.accountService.fetchAccountByName(accountName).pipe(
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

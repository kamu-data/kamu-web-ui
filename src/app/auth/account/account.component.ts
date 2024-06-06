import ProjectLinks from "src/app/project-links";
import { ModalService } from "../../components/modal/modal.service";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "./account.constants";
import { ActivatedRoute, Params } from "@angular/router";
import AppValues from "src/app/common/app.values";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { AccountService } from "src/app/services/account.service";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import { distinctUntilChanged, map, shareReplay, switchMap } from "rxjs/operators";
import { Observable, combineLatest } from "rxjs";
import { LoggedUserService } from "../logged-user.service";
import { MaybeNull } from "src/app/common/app.types";
import { AccountNotFoundError } from "src/app/common/errors";
import { AccountPageQueryParams } from "./account.component.model";

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

    constructor(
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private modalService: ModalService,
        private accountService: AccountService,
        private loggedUserService: LoggedUserService,
    ) {
        super();
    }

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
        return this.loggedUserService.currentlyLoggedInUser?.accountName === user.accountName;
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

    public onSelectOverviewTab(user: AccountFragment): void {
        this.navigationService.navigateToOwnerView(user.accountName, AccountTabs.OVERVIEW);
    }

    public onSelectDatasetsTab(user: AccountFragment): void {
        this.navigationService.navigateToOwnerView(user.accountName, AccountTabs.DATASETS);
    }

    public onSelectOrganizationsTab(user: AccountFragment): void {
        this.navigationService.navigateToOwnerView(user.accountName, AccountTabs.ORGANIZATIONS);
    }

    public onSelectInboxTab(user: AccountFragment): void {
        this.navigationService.navigateToOwnerView(user.accountName, AccountTabs.INBOX);
    }

    public onSelectStarsTab(user: AccountFragment): void {
        this.navigationService.navigateToOwnerView(user.accountName, AccountTabs.STARS);
    }

    public onSelectFlowsTab(user: AccountFragment): void {
        this.navigationService.navigateToOwnerView(user.accountName, AccountTabs.FLOWS);
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

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
import { map, shareReplay, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { LoggedUserService } from "../logged-user.service";
import { MaybeNull } from "src/app/common/app.types";
import { AccountNotFoundError } from "src/app/common/errors";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends BaseComponent implements OnInit {
    public activeTab = AccountTabs.OVERVIEW;
    public readonly AccountTabs = AccountTabs;

    public isDropdownMenu = false;
    public currentPage = 1;

    public user$: Observable<AccountFragment>;
    public datasetsAccount$: Observable<DatasetsAccountResponse>;

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
        this.user$ = this.pipelineAccountByName(accountName$);
        this.datasetsAccount$ = this.pipelineAccountDatasets(this.user$);

        this.trackSubscriptions(
            this.route.queryParams.subscribe((params: Params) => {
                params.tab ? (this.activeTab = params.tab as AccountTabs) : (this.activeTab = AccountTabs.OVERVIEW);
                params.page ? (this.currentPage = params.page as number) : (this.currentPage = 1);
            }),
        );
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

    private pipelineAccountDatasets(account$: Observable<AccountFragment>): Observable<DatasetsAccountResponse> {
        return account$.pipe(
            switchMap((account: AccountFragment) => {
                return this.accountService.getDatasetsByAccountName(account.accountName, this.currentPage - 1);
            }),
        );
    }
}

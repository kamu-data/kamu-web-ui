import { NavigationService } from "./../../../../services/navigation.service";
import { MaybeNull } from "../../../../common/app.types";
import {
    AccessTokenConnection,
    AccountFragment,
    CreatedAccessToken,
    PageBasedInfo,
    ViewAccessToken,
} from "src/app/api/kamu.graphql.interface";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AccountSettingsTabs, TokenCreateStep } from "../../account-settings.constants";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/components/modal/modal.service";
import { promiseWithCatch, requireValue } from "src/app/common/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "src/app/common/app.values";
import { AccessTokenService } from "src/app/services/access-token.service";
import { BaseComponent } from "src/app/common/base.component";
import ProjectLinks from "src/app/project-links";
import { CreateTokenFormType } from "./access-tokens-tab.types";

@Component({
    selector: "app-access-tokens-tab",
    templateUrl: "./access-tokens-tab.component.html",
    styleUrls: ["./access-tokens-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessTokensTabComponent extends BaseComponent implements OnInit {
    private fb = inject(FormBuilder);
    private modalService = inject(ModalService);
    private clipboard = inject(Clipboard);
    private accessTokenService = inject(AccessTokenService);
    private navigationService = inject(NavigationService);
    private cdr = inject(ChangeDetectorRef);

    @Input({ required: true }) public account: AccountFragment;
    @ViewChild(MatSort) sort: MatSort;
    public searchTokenName: string = "";
    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    public composedToken = "";
    public currentCreateStep = TokenCreateStep.INITIAL;
    public pageBasedInfo: PageBasedInfo;
    public createTokenForm: FormGroup<CreateTokenFormType> = this.fb.group({
        name: ["", [Validators.required, Validators.maxLength(100)]],
    });
    public showRevokedToken = false;
    public readonly DISPLAY_COLUMNS: string[] = ["status", "name", "createdAt", "revokedAt", "actions"];
    public readonly TokenCreateStep: typeof TokenCreateStep = TokenCreateStep;
    public readonly PER_PAGE = 15;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    ngOnInit(): void {
        this.getPageFromUrl();
        this.updateTable(this.currentPage);
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public get tokenNameControl(): AbstractControl {
        return this.createTokenForm.controls.name;
    }

    public refreshSearchByName(): void {
        this.searchTokenName = "";
        this.deleteComposedToken();
        this.dataSource.filter = "";
    }

    public deleteComposedToken(): void {
        this.composedToken = "";
    }

    public toggleTokens(): void {
        this.dataSource.filterPredicate = (data: unknown, filter: string): boolean => {
            return String(Boolean((data as ViewAccessToken).revokedAt)) === filter;
        };
        if (this.showRevokedToken) {
            this.dataSource.filter = "";
        } else {
            this.dataSource.filter = String(this.showRevokedToken);
        }
    }

    public deleteToken(tokenId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Revoke",
                description:
                    "Revoking a token will disable all API access for that token. The effect is immediate and final - you will not be able to re-enable the token once it's revoked and will need to generate a new one.",
                message: "Do you want to revoke a token?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.deleteComposedToken();
                        this.trackSubscription(
                            this.accessTokenService
                                .revokeAccessTokens(tokenId)
                                .subscribe(() => this.updateTable(this.currentPage)),
                        );
                    }
                },
            }),
        );
    }

    public addNewToken(): void {
        this.currentCreateStep = TokenCreateStep.GENERATE;
        this.deleteComposedToken();
    }

    public onGenerateToken(): void {
        this.accessTokenService
            .createAccessTokens(this.account.id, this.createTokenForm.controls.name.value as string)
            .subscribe((newToken: MaybeNull<CreatedAccessToken>) => {
                if (newToken) {
                    this.deleteComposedToken();
                    this.createTokenForm.controls.name.reset();
                    this.composedToken = newToken.composed;
                    this.cdr.detectChanges();
                }
            });
    }

    public onDone(): void {
        this.currentCreateStep = TokenCreateStep.FINISH;
        this.updateTable(this.currentPage);
    }

    public onCancel(): void {
        this.currentCreateStep = TokenCreateStep.INITIAL;
    }

    public applyFilter(searchToken: string): void {
        this.dataSource.filterPredicate = (data: unknown, filter: string): boolean => {
            return (data as ViewAccessToken).name.toLowerCase().includes(filter.trim().toLowerCase());
        };
        this.dataSource.filter = searchToken.trim().toLowerCase();
    }

    /* istanbul ignore next */
    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = "inline-block";
                currentElementChildren[1].style.display = "none";
                currentElement.classList.remove("clipboard-btn--success");
            }, AppValues.LONG_DELAY_MS);
            currentElementChildren[0].style.display = "none";
            currentElementChildren[1].style.display = "inline-block";
            currentElement.classList.add("clipboard-btn--success");
        }
    }

    private updateTable(page: number): void {
        this.trackSubscription(
            this.accessTokenService
                .listAccessTokens({
                    accountId: this.account.id,
                    page: page - 1,
                    perPage: this.PER_PAGE,
                })
                .subscribe((result: AccessTokenConnection) => {
                    this.dataSource.data = result.nodes;
                    this.toggleTokens();
                    this.dataSource.sort = this.sort;
                    this.pageBasedInfo = result.pageInfo;
                }),
        );
    }

    public onPageChange(page: number): void {
        this.currentPage = page;
        this.navigationService.navigateToSettings(AccountSettingsTabs.ACCESS_TOKENS, this.currentPage);
        this.updateTable(this.currentPage);
    }
}

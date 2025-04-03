/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "../../../../services/navigation.service";
import { MaybeNull } from "../../../../interface/app.types";
import {
    AccessTokenConnection,
    CreatedAccessToken,
    PageBasedInfo,
    ViewAccessToken,
} from "src/app/api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AccountSettingsTabs, TokenCreateStep } from "../../account-settings.constants";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { changeCopyIcon, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "src/app/common/values/app.values";
import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { CreateTokenFormType } from "./access-tokens-tab.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";

@Component({
    selector: "app-access-tokens-tab",
    templateUrl: "./access-tokens-tab.component.html",
    styleUrls: ["./access-tokens-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessTokensTabComponent extends BaseComponent implements OnChanges {
    private fb = inject(FormBuilder);
    private modalService = inject(ModalService);
    private clipboard = inject(Clipboard);
    private accessTokenService = inject(AccessTokenService);
    private navigationService = inject(NavigationService);
    private cdr = inject(ChangeDetectorRef);
    private loggedUserService = inject(LoggedUserService);

    @Input(RoutingResolvers.ACCOUNT_SETTINGS_ACCESS_TOKENS_KEY) public tokenConnection: AccessTokenConnection;

    @ViewChild(MatSort) private sort: MatSort;
    public searchTokenName: string = "";
    public dataSource = new MatTableDataSource();
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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.tokenConnection && changes.tokenConnection.previousValue !== changes.tokenConnection.currentValue) {
            this.tokenConnection = changes.tokenConnection.currentValue as AccessTokenConnection;
            this.dataSource.data = this.tokenConnection.nodes;
            this.toggleTokens();
            this.dataSource.sort = this.sort;
            this.pageBasedInfo = this.tokenConnection.pageInfo;
        }
    }

    public get currentPage(): number {
        return this.tokenConnection.pageInfo.currentPage + 1;
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

                        this.accessTokenService
                            .revokeAccessTokens(tokenId)
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(() => this.updateTable(this.currentPage));
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
            .createAccessTokens(
                this.loggedUserService.currentlyLoggedInUser.id,
                this.createTokenForm.controls.name.value as string,
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
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
        changeCopyIcon(event);
    }

    private updateTable(page: number): void {
        page > 1
            ? this.navigationService.navigateToSettings(AccountSettingsTabs.ACCESS_TOKENS, page)
            : this.navigationService.navigateToSettings(AccountSettingsTabs.ACCESS_TOKENS);
    }

    public onPageChange(page: number): void {
        this.updateTable(page);
    }
}

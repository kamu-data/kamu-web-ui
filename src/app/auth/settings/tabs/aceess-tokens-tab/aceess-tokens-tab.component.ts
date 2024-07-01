import {
    AccessTokenConnection,
    AccountFragment,
    PageBasedInfo,
    ViewAccessToken,
} from "src/app/api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TokenCreateStep } from "../../account-settings.constants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "src/app/common/app.values";
import { AccessTokenService } from "src/app/services/access-token.service";
import { Observable } from "rxjs";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-aceess-tokens-tab",
    templateUrl: "./aceess-tokens-tab.component.html",
    styleUrls: ["./aceess-tokens-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AceessTokensTabComponent extends BaseComponent implements OnInit {
    @Input() public account: AccountFragment;
    public searchTokenName: string = "";
    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    public composedToken = "";
    public currentCreateStep = TokenCreateStep.INITIAL;
    public pageBasedInfo: PageBasedInfo;
    public createTokenForm: FormGroup = this.fb.group({
        name: ["", [Validators.required]],
    });
    public listAccessTokens$: Observable<AccessTokenConnection>;
    public readonly DISPLAY_COLUMNS: string[] = ["name", "createdAt", "revokedAt", "actions"];
    public readonly TokenCreateStep: typeof TokenCreateStep = TokenCreateStep;
    public readonly PER_PAGE = 15;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;
    public data: ViewAccessToken[];

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private fb: FormBuilder,
        private modalService: ModalService,
        private clipboard: Clipboard,
        private accessTokenService: AccessTokenService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.updateTable();
    }

    public refreshSearchByName(): void {
        this.searchTokenName = "";
        this.dataSource.filter = "";
    }

    private updateTable(): void {
        this.accessTokenService
            .listAccessTokens({
                accountId: this.account.id,
                page: this.currentPage - 1,
                perPage: this.PER_PAGE,
            })
            .subscribe((result: AccessTokenConnection) => {
                this.dataSource.data = result.nodes;
                this.dataSource.sort = this.sort;
                this.pageBasedInfo = result.pageInfo;
                this.dataSource.filterPredicate = (data: unknown, filter: string): boolean => {
                    return (data as ViewAccessToken).name.toLowerCase().includes(filter);
                };
            });
    }

    public deleteToken(tokenId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Revoke",
                message: "Do you want to revoke a token?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.accessTokenService.revokeAccessTokens(tokenId).subscribe(() => this.updateTable());
                    }
                },
            }),
        );
    }

    public addNewToken(): void {
        this.currentCreateStep = TokenCreateStep.GENERATE;
    }

    public onGenerateToken(): void {
        this.createTokenForm.controls.name.reset();
        this.currentCreateStep = TokenCreateStep.FINISH;
    }

    public onCancel(): void {
        this.currentCreateStep = TokenCreateStep.INITIAL;
    }

    public applyFilter(searchToken: string): void {
        this.dataSource.filter = searchToken.trim().toLowerCase();
    }

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
}

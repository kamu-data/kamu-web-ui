import { PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TokenCreateStep } from "../../account-settings.constants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "src/app/common/app.values";

export interface TokenElement {
    name: string;
    last_used: string;
    added: string;
}

const ELEMENT_DATA: TokenElement[] = [
    { name: "pet-token-1", added: "3 minutes ago", last_used: "1 minute ago" },
    { name: "test-token-2", added: "2 minutes ago", last_used: "4 minute ago" },
];

@Component({
    selector: "app-aceess-tokens-tab",
    templateUrl: "./aceess-tokens-tab.component.html",
    styleUrls: ["./aceess-tokens-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AceessTokensTabComponent implements OnInit {
    public searchTokenName: string = "";
    public readonly DISPLAY_COLUMNS: string[] = ["name", "added", "last_used", "actions"];
    public dataSource = new MatTableDataSource(ELEMENT_DATA);
    public currentPage = 1;
    public readonly TokenCreateStep: typeof TokenCreateStep = TokenCreateStep;
    public currentCreateStep = TokenCreateStep.INITIAL;
    public pageBasedInfo: PageBasedInfo = {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
    };
    public createTokenForm: FormGroup = this.fb.group({
        name: ["", [Validators.required]],
    });

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private fb: FormBuilder,
        private modalService: ModalService,
        private clipboard: Clipboard,
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    public refreshSearchByName(): void {
        this.searchTokenName = "";
    }

    public deleteToken(index: number): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: "Do you want to delete a token?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        ELEMENT_DATA.splice(index, 1);
                        this.dataSource.data = ELEMENT_DATA;
                    }
                },
            }),
        );
    }

    public addNewToken(): void {
        this.currentCreateStep = TokenCreateStep.GENERATE;
    }

    public onGenerateToken(): void {
        ELEMENT_DATA.push({
            name: this.createTokenForm.controls.name?.value as string,
            added: "1 minutes ago",
            last_used: "2 minute ago",
        });
        this.createTokenForm.controls.name.reset();
        this.dataSource.data = ELEMENT_DATA;
        this.currentCreateStep = TokenCreateStep.FINISH;
    }

    public onCancel(): void {
        this.currentCreateStep = TokenCreateStep.INITIAL;
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

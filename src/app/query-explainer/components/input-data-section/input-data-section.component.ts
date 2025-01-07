import { AfterViewChecked, ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
} from "../../query-explainer.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { QueryExplainerComponentData } from "../../query-explainer.component";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-input-data-section",
    templateUrl: "./input-data-section.component.html",
    styleUrls: ["./input-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDataSectionComponent implements AfterViewChecked {
    @Input({ required: true }) public blockHashObservables$: Observable<Date>[];
    @Input({ required: true }) public datasetInfoObservables$: Observable<DatasetInfo>[];
    @Input({ required: true }) inputData: QueryExplainerComponentData;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    ngAfterViewChecked(): void {
        this.addDynamicRunButton();
    }

    public isDatasetBlockNotFoundError(error: MaybeUndefined<VerifyQueryError>, blockHash: string): boolean {
        return (
            error?.kind === VerifyQueryKindError.DatasetBlockNotFound &&
            (error as VerifyQueryDatasetBlockNotFoundError).block_hash === blockHash
        );
    }

    public isDatasetNotFoundError(error: MaybeUndefined<VerifyQueryError>, datasetId: string): boolean {
        return (
            error?.kind === VerifyQueryKindError.DatasetNotFound &&
            (error as VerifyQueryDatasetNotFoundError).dataset_id === datasetId
        );
    }

    public get sqlCode(): string {
        return this.inputData.sqlQueryExplainerResponse.input.query;
    }

    public sqlWrapper(sqlCode: string): string {
        return "```sql\n" + sqlCode + "\n```";
    }

    private addDynamicRunButton(): void {
        // Find all sql queries between ```sql and ```
        const sqlQueries = this.sqlWrapper(this.sqlCode).match(/(?<=```sql\s+).*?(?=\s+```)/gs);
        const containerRunButtonElement: HTMLCollectionOf<Element> =
            document.getElementsByClassName("container-run-button");

        if (sqlQueries?.length && !containerRunButtonElement.length) {
            const preElements: NodeListOf<Element> = document.querySelectorAll("pre.language-sql");
            preElements.forEach((preElement: Element, index: number) => {
                const divElement: HTMLDivElement = document.createElement("div");
                divElement.classList.add("container-run-button");
                divElement.style.position = "absolute";
                divElement.style.top = "10px";
                divElement.style.right = "65px";
                const linkElement = document.createElement("a");
                linkElement.classList.add("markdown-run-button");
                linkElement.style.padding = "3.6px 16px";
                linkElement.style.color = "#ffff";
                linkElement.style.fontSize = "13px";
                linkElement.style.textDecoration = "none";
                linkElement.style.backgroundColor = "rgba(255,255, 255, 0.07)";
                linkElement.style.borderRadius = "4px";
                linkElement.style.transition = "all 250ms ease-out";
                linkElement.setAttribute("target", "_blank");
                linkElement.setAttribute(
                    "href",
                    `/${ProjectLinks.URL_QUERY}?${ProjectLinks.URL_QUERY_PARAM_SQL_QUERY}=${encodeURI(sqlQueries[index])}`,
                );
                linkElement.addEventListener("mouseover", () => {
                    linkElement.style.backgroundColor = "rgba(255,255, 255, 0.14)";
                });
                linkElement.addEventListener("mouseleave", () => {
                    linkElement.style.backgroundColor = "rgba(255,255, 255, 0.07)";
                });
                linkElement.innerHTML = "Run";
                divElement.appendChild(linkElement);
                preElement.after(divElement);
            });
        }
    }
}

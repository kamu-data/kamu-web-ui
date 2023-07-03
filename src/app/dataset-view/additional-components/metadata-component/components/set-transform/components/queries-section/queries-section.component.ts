import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { SqlQueryStep } from "src/app/api/kamu.graphql.interface";
import * as monaco from "monaco-editor";
import { ViewportScroller } from "@angular/common";

@Component({
    selector: "app-queries-section",
    templateUrl: "./queries-section.component.html",
    styleUrls: ["./queries-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueriesSectionComponent implements OnChanges {
    @Input() public queries: Omit<SqlQueryStep, "__typename">[];
    @Input() public datasetName: string;
    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "sql",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

    constructor(private scroll: ViewportScroller) {}

    ngOnChanges(changes: SimpleChanges): void {
        const currentQueries = changes.queries.currentValue as Omit<
            SqlQueryStep,
            "__typename"
        >[];
        if (!currentQueries.length) {
            this.queries.push({
                alias: this.datasetName,
                query: "",
            });
        }
    }

    public isLastQuery(index: number): boolean {
        return index === this.queries.length - 1;
    }

    public isPenultimateQuery(index: number): boolean {
        return index === this.queries.length - 2;
    }

    public addQuery(): void {
        this.queries.unshift({
            alias: "",
            query: "",
        });
        this.scroll.scrollToPosition([0, 0]);
    }

    public deleteQuery(index: number): void {
        this.queries.splice(index, 1);
    }

    public swap(index: number, direction: number): void {
        const condition =
            direction > 0 ? index === this.queries.length - 1 : index === 0;
        if (condition) {
            return;
        }
        const current = this.queries.find((_, i) => index === i);
        this.queries.splice(index, 1);
        if (current) {
            this.queries.splice(index + direction, 0, current);
        }
    }
}

import { Injectable } from "@angular/core";
import {
    SetTransform,
    SqlQueryStep,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { parse } from "yaml";
import {
    EditSetTransformParseType,
    SetTransFormYamlType,
} from "./set-transform.types";

@Injectable({
    providedIn: "root",
})
export class EditSetTransformService {
    public history: DatasetHistoryUpdate;

    public parseEventFromYaml(event: string): SetTransFormYamlType {
        const editFormParseValue = parse(event) as EditSetTransformParseType;
        return editFormParseValue.content.event;
    }

    public parseInputDatasets(datasets: Set<string>): TransformInput[] {
        return Array.from(datasets).map(
            (item) => JSON.parse(item) as TransformInput,
        );
    }

    public transformEventAsObject(
        inputDatasets: Set<string>,
        engine: string,
        queries: Omit<SqlQueryStep, "__typename">[],
    ): Omit<SetTransform, "__typename"> {
        return {
            inputs: this.parseInputDatasets(inputDatasets),
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        } as Omit<SetTransform, "__typename">;
    }
}

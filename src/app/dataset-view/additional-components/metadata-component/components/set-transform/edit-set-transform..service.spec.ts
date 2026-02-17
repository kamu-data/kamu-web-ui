/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { SqlQueryStep, TransformInput } from "@api/kamu.graphql.interface";

import { Engine } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.types";
import { EditSetTransformService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/edit-set-transform..service";
import {
    mockParseSetTransformYamlType,
    mockSetTransformEventYaml,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";

describe("EditSetTransformService", () => {
    let service: EditSetTransformService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EditSetTransformService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check #parseInputDatasets() method", () => {
        const inputDatasets = new Set<string>([
            '{"datasetRef":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","alias":"account.tokens.portfolio.usd"}',
        ]);
        const result = [
            {
                datasetRef: "did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX",
                alias: "account.tokens.portfolio.usd",
            },
        ] as TransformInput[];

        expect(service.parseInputDatasets(inputDatasets)).toEqual(result);
    });

    it("should check #transformEventAsObject() method", () => {
        const inputDatasets = new Set<string>([
            '{"id":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","name":"account.tokens.portfolio.usd"}',
        ]);
        const engine = Engine.Spark;
        const queries = [{ alias: "alias1", query: "query1" }] as Omit<SqlQueryStep, "__typename">[];
        const result = {
            inputs: service.parseInputDatasets(inputDatasets),
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        };
        expect(service.transformEventAsObject(inputDatasets, engine, queries)).toEqual(result);
    });

    it("should check #parseEventFromYaml() method", () => {
        const event = mockSetTransformEventYaml;
        const result = mockParseSetTransformYamlType;
        expect(service.parseEventFromYaml(event)).toEqual(result);
    });
});

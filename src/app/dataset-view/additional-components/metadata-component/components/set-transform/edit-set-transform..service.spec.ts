/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { Engine } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.types";
import { EditSetTransformService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/edit-set-transform..service";
import {
    mockParseSetTransformYamlType,
    mockSetTransformEventYaml,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    SetTransformEvent,
    TransformQueryStep,
    TransformSelectedInput,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";

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

    it("should build the event from the inputs with their aliases trimmed", () => {
        const inputs: TransformSelectedInput[] = [
            { datasetRef: "did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX", alias: " portfolio " },
        ];
        const engine = Engine.Spark;
        const queries: TransformQueryStep[] = [{ alias: "alias1", query: "query1" }];
        const result: SetTransformEvent = {
            inputs: [
                {
                    datasetRef: "did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX",
                    alias: "portfolio",
                },
            ],
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        };
        expect(service.transformEventAsObject(inputs, engine, queries)).toEqual(result);
    });

    it("should check #parseEventFromYaml() method", () => {
        const event = mockSetTransformEventYaml;
        const result = mockParseSetTransformYamlType;
        expect(service.parseEventFromYaml(event)).toEqual(result);
    });
});

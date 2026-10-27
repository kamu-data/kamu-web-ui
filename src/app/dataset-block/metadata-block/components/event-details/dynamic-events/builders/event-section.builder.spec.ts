/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ADD_DATA_SOURCE_DESCRIPTORS } from "src/app/dataset-block/metadata-block/components/event-details/components/add-data-event/add-data-event.source";
import { HashPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/hash-property/hash-property.component";
import { UnsupportedPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/unsupported-property/unsupported-property.component";
import { AddDataSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/add-data-section.builder";

describe("EventSectionBuilder", () => {
    const builder = new AddDataSectionBuilder();

    it("should render a value that fits the row's component with its descriptor", () => {
        const row = builder.buildSupportedRow(
            "AddData",
            ADD_DATA_SOURCE_DESCRIPTORS,
            "string",
            "prevCheckpoint",
            "f1620a",
        );

        expect(row.descriptor.presentationComponent).toBe(HashPropertyComponent);
        expect(row.value).toEqual("f1620a");
    });

    it("should render a value that does not fit the row's component as unsupported", () => {
        const value = { start: "0", end: "9" };
        const row = builder.buildSupportedRow(
            "AddData",
            ADD_DATA_SOURCE_DESCRIPTORS,
            "string",
            "prevCheckpoint",
            value,
        );

        expect(row.descriptor.presentationComponent).toBe(UnsupportedPropertyComponent);
        expect(row.descriptor.label).toEqual("Unsupported(prevCheckpoint)");
        expect(row.value).toBe(value);
    });

    it("should render a key with no descriptor as unsupported", () => {
        const row = builder.buildSupportedRow("AddData", ADD_DATA_SOURCE_DESCRIPTORS, "string", "unknownKey", "a");

        expect(row.descriptor.presentationComponent).toBe(UnsupportedPropertyComponent);
        expect(row.descriptor.label).toEqual("Unsupported(unknownKey)");
    });
});

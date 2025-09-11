/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowItemWidgetDataFragment } from "src/app/api/kamu.graphql.interface";
import { mockFlowItemWidgetDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";

describe("TileBaseWidgetHelpers", () => {
    const EXPECTED_CLASS_NAMES = [
        "success-class",
        "running-class",
        "waiting-class",
        "aborted-class",
        "failed-class",
        "retrying-class",
        "failed-class",
    ];

    mockFlowItemWidgetDataFragments.forEach((item: FlowItemWidgetDataFragment, index: number) => {
        it(`should check set class name equal ${EXPECTED_CLASS_NAMES[index]}`, () => {
            expect(TileBaseWidgetHelpers.tileWidgetClass(item)).toEqual(EXPECTED_CLASS_NAMES[index]);
        });
    });
});

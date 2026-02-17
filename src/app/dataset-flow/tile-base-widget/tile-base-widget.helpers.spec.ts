/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TileBaseWidgetHelpers } from "src/app/dataset-flow/tile-base-widget/tile-base-widget.helpers";

import { FlowItemWidgetDataFragment } from "@api/kamu.graphql.interface";
import { mockFlowItemWidgetDataFragments } from "@api/mock/dataset-flow.mock";

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

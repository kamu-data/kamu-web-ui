/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowItemWidgetDataFragment } from "src/app/api/kamu.graphql.interface";
import { mockFlowItemWidgetDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";

const resultsClassName = ["success-class", "running-class", "waiting-class", "aborted-class", "failed-class"];

describe("TileBaseWidgetHelpers", () => {
    mockFlowItemWidgetDataFragments.forEach((item: FlowItemWidgetDataFragment, index: number) => {
        it(`should check set class name equal ${resultsClassName[index]}`, () => {
            expect(TileBaseWidgetHelpers.tileWidgetClass(item)).toEqual(resultsClassName[index]);
        });
    });
});

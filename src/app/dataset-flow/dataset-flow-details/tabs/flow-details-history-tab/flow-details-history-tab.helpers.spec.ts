/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { DatasetFlowDetailsHelpers } from "./flow-details-history-tab.helpers";
import {
    eventFlowDescriptionsResultHistoryTab,
    flowEventIconOptionsResults,
    flowEventSubMessageResults,
    mockFlowHistoryDataFragmentForDescriptions,
    mockFlowHistoryDataFragmentForIconOptions,
    mockFlowHistoryDataFragmentForSubMessages,
    mockFlowSummaryDataFragmentIngestResult,
    mockHistoryFragmentWithFinishedStatus,
} from "./flow-details-history-tab.helpers.mock";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { mockDatasetExecuteTransformFlowSummaryData } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import timekeeper from "timekeeper";

describe("DatasetFlowDetailsHelpers", () => {
    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
    });

    afterAll(() => {
        timekeeper.reset();
    });

    mockFlowHistoryDataFragmentForDescriptions.forEach((item, index) => {
        it(`should check flow event description with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowEventDescription(item, mockFlowSummaryDataFragments[2])).toEqual(
                eventFlowDescriptionsResultHistoryTab[index],
            );
        });
    });

    mockFlowHistoryDataFragmentForIconOptions.forEach((item, index) => {
        it(`should check flow event icon and class with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowEventIconOptions(item, mockFlowSummaryDataFragments[0])).toEqual(
                flowEventIconOptionsResults[index],
            );
        });
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and flow outcome = Success `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[0],
            ),
        ).toEqual(flowEventIconOptionsResults[6]);
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and flow outcome = Failed `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[4],
            ),
        ).toEqual(flowEventIconOptionsResults[7]);
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and flow outcome = Aborted `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[3],
            ),
        ).toEqual(flowEventIconOptionsResults[8]);
    });

    mockFlowHistoryDataFragmentForSubMessages.forEach((item, index) => {
        it(`should check flow event submessage with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowEventSubMessage(item, mockFlowSummaryDataFragments[0])).toEqual(
                flowEventSubMessageResults[index],
            );
        });
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Failed`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[4],
            ),
        ).toEqual(flowEventSubMessageResults[11]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ingestResult=null)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[0],
            ),
        ).toEqual(flowEventSubMessageResults[12]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ingestResult!==null)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragmentIngestResult,
            ),
        ).toEqual(flowEventSubMessageResults[13]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ExecuteTransform)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockDatasetExecuteTransformFlowSummaryData,
            ),
        ).toEqual(flowEventSubMessageResults[14]);
    });

    it(`should check don't show dynamic image`, () => {
        const expectedResult = "";
        expect(DatasetFlowDetailsHelpers.dynamicImgSrc(FlowStatus.Finished)).toEqual(expectedResult);
    });
});

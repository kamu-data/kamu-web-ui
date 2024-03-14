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
import { mockDatasetExecuteTransformFlowSummaryData } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.helpers.mock";
import moment from "moment";

describe("DatasetFlowDetailsHelpers", () => {
    beforeAll(() => {
        moment().tz("Europe/Kiev");
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
        ).toEqual(flowEventIconOptionsResults[5]);
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and flow outcome = Failed `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[4],
            ),
        ).toEqual(flowEventIconOptionsResults[6]);
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and flow outcome = Aborted `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[3],
            ),
        ).toEqual(flowEventIconOptionsResults[7]);
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
        ).toEqual(flowEventSubMessageResults[10]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ingestResult=null)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[0],
            ),
        ).toEqual(flowEventSubMessageResults[11]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ingestResult!==null)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragmentIngestResult,
            ),
        ).toEqual(flowEventSubMessageResults[12]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ExecuteTransform)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockDatasetExecuteTransformFlowSummaryData,
            ),
        ).toEqual(flowEventSubMessageResults[13]);
    });
});

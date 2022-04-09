import { Injectable } from "@angular/core";
import * as moment from "moment-timezone";
import { MetadataBlockFragment } from "../api/kamu.graphql.interface";

@Injectable()
export class DataHelpersService {
    public shortHash(hash: string): string {
        return hash.slice(-8);
    }

    public relativeTime(rfc3339date: string): string {
        const dt = moment(rfc3339date);
        const delta = moment.duration(dt.diff(moment()));
        return delta.humanize(true);
    }

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        const event = block.event;
        switch (event.__typename) {
            case "AddData":
                return `Added ${
                    event.addedOutputData
                        ? event.addedOutputData.interval.end -
                          event.addedOutputData.interval.start
                        : "0"
                } new records`;
            case "ExecuteQuery":
                return `Transformation produced ${
                    event.queryOutputData
                        ? event.queryOutputData.interval.end -
                          event.queryOutputData.interval.start
                        : "0"
                } new records`;
            case "Seed":
                return `Dataset initialized`;
            case "SetTransform":
                return `Query changed`;
            case "SetVocab":
                return `Vocabulary changed`;
            case "SetWatermark":
                return `Watermark updated to ${event.outputWatermark}`;
            case "SetPollingSource":
                return `Polling source changed`;
            case "SetInfo":
                return `Basic information updated`;
            case "SetLicense":
                return `License updated: ${event.name}`;
            case "SetAttachments":
                return `Attachments updated`;
        }
    }
}

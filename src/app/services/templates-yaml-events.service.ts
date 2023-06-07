import { SetLicense, SetPollingSource } from "./../api/kamu.graphql.interface";
import { Injectable } from "@angular/core";
import { MaybeNull } from "../common/app.types";
import { stringify } from "yaml";

@Injectable({
    providedIn: "root",
})
export class TemplatesYamlEventsService {
    private readonly initialSetInfoTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setInfo\n";
    private readonly initialSetLicenseTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setLicense\n";
    private readonly initialSetWatermarkTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setWatermark\n";

    private readonly initialTemplate = {
        kind: "MetadataEvent",
        version: 1,
        content: {},
    };

    public buildYamlSetInfoEvent(
        description: MaybeNull<string>,
        keywords: MaybeNull<string[]>,
    ): string {
        let result = this.initialSetInfoTemplate;
        if (description) result += `  description: ${description}\n`;
        if (keywords?.length) {
            result += `  keywords:\n`;
            keywords.forEach(
                (keyword: string) => (result += `    - ${keyword}\n`),
            );
        }
        return result;
    }

    public buildYamlSetLicenseEvent(
        params: Omit<SetLicense, "__typename">,
    ): string {
        let result = this.initialSetLicenseTemplate;
        result += `  name: ${params.name}\n`;
        result += `  shortName: ${params.shortName}\n`;
        result += `  websiteUrl: ${params.websiteUrl}\n`;
        if (params.spdxId) result += `  spdxId: ${params.spdxId.toString()}\n`;
        return result;
    }

    public buildYamlSetPollingSourceEvent(
        params: Omit<SetPollingSource, "__typename">,
    ): string {
        this.initialTemplate.content = {
            kind: "setPollingSource",
            ...params,
        };
        return stringify(this.initialTemplate);
    }

    public buildYamlSetWatermarkEvent(dateTime: string): string {
        let result = this.initialSetWatermarkTemplate;
        result += `  outputWatermark: ${dateTime}`;
        return result;
    }
}

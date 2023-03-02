import { Injectable } from "@angular/core";
import { MaybeNull } from "../common/app.types";

@Injectable({
    providedIn: "root",
})
export class TemplatesYamlEventsService {
    private readonly initialSetInfoTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setInfo\n";

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
}

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { SupportedEvents } from "../event-details/supported.events";
import { Observable } from "rxjs";
import { eventsWithYamlView } from "./yaml-view-section.types";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlViewSectionComponent {
    public yamlEventText$: Observable<string>;

    constructor(private blockService: BlockService) {
        this.yamlEventText$ = this.blockService.metadataBlockAsYamlChanges;
    }

    public get currentBlock(): MetadataBlockFragment {
        return this.blockService.currentBlock;
    }

    public get isEventWithYamlView(): boolean {
        return eventsWithYamlView.includes(this.currentBlock.event.__typename as SupportedEvents);
    }
}

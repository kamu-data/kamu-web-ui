import { Pipe, PipeTransform } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

@Pipe({
    name: "eventTypeFilter",
})
export class EventTypeFilterPipe implements PipeTransform {
    transform(
        blocks: MetadataBlockFragment[],
        filter: string,
    ): MetadataBlockFragment[] {
        if (filter === "None") {
            return blocks;
        }
        return blocks.filter((block) => block.event.__typename === filter);
    }
}

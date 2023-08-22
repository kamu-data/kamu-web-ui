import { Pipe, PipeTransform } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

@Pipe({
    name: "eventTypeFilter",
})
export class EventTypeFilterPipe implements PipeTransform {
    transform(
        blocks: MetadataBlockFragment[],
        filters: string[],
        allHistory: MetadataBlockFragment[],
    ): MetadataBlockFragment[] {
        if (!filters.length) {
            return blocks;
        } else {
            const result = [] as MetadataBlockFragment[];
            filters.forEach((filter: string) =>
                result.push(...allHistory.filter((block) => block.event.__typename === filter)),
            );
            return result;
        }
    }
}

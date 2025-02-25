import { Pipe, PipeTransform } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

@Pipe({
    name: "blockHashFilter",
})
export class BlockHashFilterPipe implements PipeTransform {
    public transform(blocks: MetadataBlockFragment[], filter: string): MetadataBlockFragment[] {
        if (filter === "") return blocks;
        return blocks.filter((block: MetadataBlockFragment) => block.blockHash.includes(filter));
    }
}

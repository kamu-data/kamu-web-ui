/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

@Pipe({
    name: "eventTypeFilter",
    standalone: true,
})
export class EventTypeFilterPipe implements PipeTransform {
    public transform(blocks: MetadataBlockFragment[], filters: string[]): MetadataBlockFragment[] {
        if (!filters.length) {
            return blocks;
        } else {
            const result = [] as MetadataBlockFragment[];
            filters.forEach((filter: string) =>
                result.push(...blocks.filter((block) => block.event.__typename === filter)),
            );
            return result;
        }
    }
}

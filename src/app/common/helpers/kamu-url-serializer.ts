import { Injectable } from "@angular/core";
import { DefaultUrlSerializer, UrlSegment, UrlSegmentGroup, UrlTree } from "@angular/router";

import { maskDotsInURL } from "./app.helpers";

@Injectable()
export class KamuUrlSerializer extends DefaultUrlSerializer {
    override serialize(tree: UrlTree): string {
        const url = super.serialize(tree);
        return maskDotsInURL(url, 2);
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Pipe, PipeTransform } from "@angular/core";
import { UrlTree } from "@angular/router";

import { DatasetInfo } from "@interface/navigation.interface";

import { SourceEventEditor } from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

/** Link to a metadata event editor, built by `NavigationService.sourceEventEditorUrlTree`. */
@Pipe({
    name: "sourceEventEditorLink",
})
export class SourceEventEditorLinkPipe implements PipeTransform {
    private navigationService = inject(NavigationService);

    public transform(params: DatasetInfo, editor: SourceEventEditor, sourceName?: string): UrlTree {
        return this.navigationService.sourceEventEditorUrlTree(params, editor, sourceName);
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { parse } from "yaml";
import { AddPushSourceEditFormType, EditAddPushSourceParseType } from "./add-push-source-form.types";
import { BaseYamlEventService } from "src/app/services/base-yaml-event.service";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService extends BaseYamlEventService {
    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const editFormParseValue = parse(event) as EditAddPushSourceParseType;
        return editFormParseValue.content.event;
    }
}

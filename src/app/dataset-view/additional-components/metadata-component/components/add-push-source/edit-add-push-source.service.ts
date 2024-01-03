import { Injectable } from "@angular/core";
import { parse } from "yaml";
import { AddPushSourceEditFormType, EditAddPushSourceParseType } from "./add-push-source-form.types";
import { BaseYamlEventService } from "src/app/common/base-yaml-event.service";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService extends BaseYamlEventService {
    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const editFormParseValue = parse(event) as EditAddPushSourceParseType;
        return editFormParseValue.content.event;
    }
}

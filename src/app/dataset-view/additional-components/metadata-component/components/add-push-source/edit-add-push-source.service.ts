import { Injectable } from "@angular/core";
import { parse } from "yaml";
import { AddPushSourceEditFormType, EditAddPushSourceParseType } from "./add-push-source-form.types";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService {
    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const editFormParseValue = parse(event) as EditAddPushSourceParseType;
        return editFormParseValue.content.event;
    }
}

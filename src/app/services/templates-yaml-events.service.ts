/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { stringify } from "yaml";

import { schemaFieldsToObjectForm } from "@common/helpers/data-schema.helpers";
import { SetLicense } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { SetTransformEvent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import {
    AddPollingSourceEditFormType,
    PreprocessKind,
    PreprocessStepValue,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { AddPushSourceEditFormType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";

@Injectable({
    providedIn: "root",
})
export class TemplatesYamlEventsService {
    public buildYamlSetInfoEvent(description: MaybeNull<string>, keywords: MaybeNull<string[]>): string {
        return this.metadataEventYaml({
            kind: "SetInfo",
            ...(description ? { description } : {}),
            ...(keywords?.length ? { keywords } : {}),
        });
    }

    public buildYamlSetLicenseEvent(params: Omit<SetLicense, "__typename">): string {
        return this.metadataEventYaml({
            kind: "SetLicense",
            name: params.name,
            shortName: params.shortName,
            websiteUrl: params.websiteUrl,
            ...(params.spdxId ? { spdxId: params.spdxId } : {}),
        });
    }

    public buildYamlSetPollingSourceEvent(
        params: AddPollingSourceEditFormType,
        preprocessStepValue: MaybeNull<PreprocessStepValue>,
    ): string {
        if (params.read.jsonKind === ReadKind.ND_JSON) {
            delete params.read.subPath;
        }
        if (params.read.jsonKind) {
            params.read.kind = params.read.jsonKind;
            delete params.read.jsonKind;
        }

        let content: object = {
            kind: "SetPollingSource",
            ...params,
        };

        const schemaFields = params.read.schema;
        if (schemaFields?.length) {
            content = {
                ...content,
                read: {
                    ...params.read,
                    schema: schemaFieldsToObjectForm(schemaFields),
                },
            };
        }

        if (preprocessStepValue?.queries.length && preprocessStepValue.queries[0].query) {
            content = {
                ...content,
                preprocess: {
                    kind: PreprocessKind.SQL,
                    engine: preprocessStepValue.engine.toLowerCase(),
                    queries: preprocessStepValue.queries,
                },
            };
        }

        return this.metadataEventYaml(content);
    }

    public buildYamlAddPushSourceEvent(
        params: AddPushSourceEditFormType,
        preprocessStepValue: MaybeNull<PreprocessStepValue>,
    ): string {
        if (params.read.jsonKind === ReadKind.ND_JSON) {
            delete params.read.subPath;
        }
        if (params.read.jsonKind) {
            params.read.kind = params.read.jsonKind;
            delete params.read.jsonKind;
        }
        let content: object = {
            kind: "AddPushSource",
            ...params,
        };

        const pushSchemaFields = params.read.schema;
        if (pushSchemaFields?.length) {
            content = {
                ...content,
                read: {
                    ...params.read,
                    schema: schemaFieldsToObjectForm(pushSchemaFields),
                },
            };
        }

        if (preprocessStepValue?.queries.length && preprocessStepValue.queries[0].query) {
            content = {
                ...content,
                preprocess: {
                    kind: PreprocessKind.SQL,
                    engine: preprocessStepValue.engine.toLowerCase(),
                    queries: preprocessStepValue.queries,
                },
            };
        }

        return this.metadataEventYaml(content);
    }

    public buildYamlSetTransformEvent(params: SetTransformEvent): string {
        return this.metadataEventYaml({
            kind: "SetTransform",
            ...params,
        });
    }

    public buildYamlSetWatermarkEvent(dateTime: string): string {
        return this.metadataEventYaml({ kind: "SetWatermark", outputWatermark: dateTime });
    }

    public buildYamlDisablePollingSourceEvent(): string {
        return this.metadataEventYaml({ kind: "DisablePollingSource", dummy: "test" });
    }

    /** Serializes the event, so text the user typed is quoted wherever YAML would read it as syntax. */
    private metadataEventYaml(content: object): string {
        return stringify({ kind: "MetadataEvent", version: 1, content });
    }
}

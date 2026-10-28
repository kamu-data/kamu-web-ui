/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader, HarnessPredicate } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { ArrayKeysFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.harness";
import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";
import { CacheFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.harness";
import { CheckboxFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/checkbox-field/checkbox-field.harness";
import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { JsonKindFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.harness";
import { KeyValueFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.harness";
import { NumberFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.harness";
import { OrderFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.harness";
import { SchemaFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.harness";
import { SelectDateFormatFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-date-format-field/select-date-format-field.harness";
import { TopicsFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.harness";
import { TypeaheadFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.harness";
import {
    ControlType,
    EventTimeSourceKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { SourceField } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { sourceField } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-field";
import {
    eventTimeControl,
    nameValueListControl,
    numberInputControl,
    textControl,
    textListControl,
    topicListControl,
    valueControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { SourceFieldsComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-fields/source-fields.component";
import { SourceFieldsHarness } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-fields/source-fields.harness";

const ALWAYS = (): boolean => true;

/** One field of every type, in the order the config of a step would list them. */
function fieldOfEveryType(): SourceField[] {
    return [
        sourceField({ name: "url", label: "Url", tooltip: "", type: ControlType.TEXT }, textControl(""), ALWAYS),
        sourceField(
            { name: "dateFormat", label: "Date format", tooltip: "", type: ControlType.TYPEAHEAD, list: ["rfc3339"] },
            textControl(""),
            ALWAYS,
        ),
        sourceField(
            { name: "port", label: "Port", tooltip: "", type: ControlType.NUMBER, min: 1, max: 65535 },
            numberInputControl()([]),
            ALWAYS,
        ),
        sourceField(
            { name: "header", label: "Header", tooltip: "", type: ControlType.CHECKBOX },
            valueControl(false)([]),
            ALWAYS,
        ),
        sourceField(
            { name: "cache", label: "Use cache", tooltip: "", type: ControlType.CACHE },
            valueControl(false)([]),
            ALWAYS,
        ),
        sourceField(
            { name: "order", label: "Order", tooltip: "", type: ControlType.ORDER },
            valueControl(SourceOrder.NONE)([]),
            ALWAYS,
        ),
        sourceField(
            {
                name: "jsonKind",
                label: "Select reader format",
                tooltip: "",
                type: ControlType.JSON_KIND,
                readFormatDescriptors: [{ label: "JSON", value: ReadKind.JSON }],
            },
            valueControl(ReadKind.JSON)([]),
            ALWAYS,
        ),
        sourceField(
            { name: "schema", label: "Schema", tooltip: "", type: ControlType.SCHEMA },
            valueControl<DataSchemaField[]>([])([]),
            ALWAYS,
        ),
        sourceField(
            {
                name: "eventTime",
                label: "Event time",
                tooltip: "",
                type: ControlType.EVENT_TIME,
                options: { innerTooltips: {} },
            },
            eventTimeControl()([]),
            ALWAYS,
        ),
        sourceField(
            {
                name: "headers",
                label: "Headers",
                tooltip: "",
                type: ControlType.ARRAY_KEY_VALUE,
                options: { buttonText: "+ Add headers" },
            },
            nameValueListControl()([]),
            ALWAYS,
        ),
        sourceField(
            {
                name: "topics",
                label: "Topics",
                tooltip: "",
                type: ControlType.TOPICS,
                options: { buttonText: "+ Add new topic" },
            },
            topicListControl()([]),
            ALWAYS,
        ),
        sourceField(
            {
                name: "primaryKey",
                label: "Primary key",
                tooltip: "",
                type: ControlType.ARRAY_KEY,
                placeholder: "Enter column name",
                options: { buttonText: "+ Add primary key" },
            },
            textListControl()([]),
            ALWAYS,
        ),
    ];
}

@Component({
    imports: [SourceFieldsComponent],
    template: `<app-source-fields [fields]="fields" sectionName="fetch" />`,
})
class TestSourceFieldsHostComponent {
    public fields: readonly SourceField[] = fieldOfEveryType();
}

describe("SourceFieldsComponent", () => {
    let fixture: ComponentFixture<TestSourceFieldsHostComponent>;
    let host: TestSourceFieldsHostComponent;
    let loader: HarnessLoader;
    let harness: SourceFieldsHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSourceFieldsHostComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();
        registerMatSvgIcons();

        fixture = TestBed.createComponent(TestSourceFieldsHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
        harness = await loader.getHarness(SourceFieldsHarness);
    });

    it("should prefix each field's test id with the section name", async () => {
        expect(await harness.getFieldTestIds()).toEqual([
            "fetch-url",
            "fetch-dateFormat",
            "fetch-port",
            "fetch-header",
            "fetch-cache",
            "fetch-order",
            "fetch-jsonKind",
            "fetch-schema",
            "fetch-eventTime",
            "fetch-headers",
            "fetch-topics",
            "fetch-primaryKey",
        ]);
    });

    it("should render each field type with its field component", async () => {
        const expected: { harness: HarnessPredicate<BaseFieldHarness>; label: string }[] = [
            { harness: InputFieldHarness.with({ dataTestId: "fetch-url" }), label: "Url" },
            { harness: TypeaheadFieldHarness.with({ dataTestId: "fetch-dateFormat" }), label: "Date format" },
            { harness: NumberFieldHarness.with({ dataTestId: "fetch-port" }), label: "Port" },
            { harness: CheckboxFieldHarness.with({ dataTestId: "fetch-header" }), label: "Header" },
            { harness: CacheFieldHarness.with({ dataTestId: "fetch-cache" }), label: "Use cache" },
            { harness: OrderFieldHarness.with({ dataTestId: "fetch-order" }), label: "Order" },
            { harness: JsonKindFieldHarness.with({ dataTestId: "fetch-jsonKind" }), label: "Select reader format" },
            { harness: SchemaFieldHarness.with({ dataTestId: "fetch-schema" }), label: "Schema" },
            { harness: SelectDateFormatFieldHarness.with({ dataTestId: "fetch-eventTime" }), label: "Event time" },
            { harness: KeyValueFieldHarness.with({ dataTestId: "fetch-headers" }), label: "Headers" },
            { harness: TopicsFieldHarness.with({ dataTestId: "fetch-topics" }), label: "Topics" },
            { harness: ArrayKeysFieldHarness.with({ dataTestId: "fetch-primaryKey" }), label: "Primary key" },
        ];
        for (const { harness: query, label } of expected) {
            const field = await loader.getHarness(query);
            expect(await field.getLabel()).toBe(label);
        }
    });

    it("should bind each field to its control", async () => {
        const url = await loader.getHarness(InputFieldHarness.with({ dataTestId: "fetch-url" }));
        await url.setValue("https://example.com");

        expect(host.fields[0].control.value).toBe("https://example.com");
    });

    it("should keep the radios of one field checked when another field's radio is picked", async () => {
        const order = await loader.getHarness(OrderFieldHarness);
        const eventTime = await loader.getHarness(SelectDateFormatFieldHarness);

        await eventTime.selectKind(EventTimeSourceKind.FROM_SYSTEM_TIME);

        expect(await order.isOrderSelected(SourceOrder.NONE)).toBe(true);
        expect(await eventTime.isKindSelected(EventTimeSourceKind.FROM_SYSTEM_TIME)).toBe(true);
    });

    it("should use the test id the layout names over the section's one", async () => {
        host.fields = [
            sourceField(
                { name: "url", label: "Url", tooltip: "", type: ControlType.TEXT, dataTestId: "custom-url" },
                textControl(""),
                ALWAYS,
            ),
        ];

        expect(await harness.getFieldTestIds()).toEqual(["custom-url"]);
    });

    it("should hide a field while it is not shown", async () => {
        const jsonKind = valueControl(ReadKind.JSON)([]);
        host.fields = [
            sourceField(
                {
                    name: "jsonKind",
                    label: "Select reader format",
                    tooltip: "",
                    type: ControlType.JSON_KIND,
                    readFormatDescriptors: [
                        { label: "JSON", value: ReadKind.JSON },
                        { label: "Newline-delimited JSON", value: ReadKind.ND_JSON },
                    ],
                },
                jsonKind,
                ALWAYS,
            ),
            sourceField(
                { name: "subPath", label: "Path", tooltip: "", type: ControlType.TEXT },
                textControl(""),
                () => jsonKind.value === ReadKind.JSON,
            ),
        ];
        expect(await harness.getFieldTestIds()).toEqual(["fetch-jsonKind", "fetch-subPath"]);

        const jsonKindField = await loader.getHarness(JsonKindFieldHarness);
        await jsonKindField.selectKind(ReadKind.ND_JSON);
        expect(await harness.getFieldTestIds()).toEqual(["fetch-jsonKind"]);

        await jsonKindField.selectKind(ReadKind.JSON);
        expect(await harness.getFieldTestIds()).toEqual(["fetch-jsonKind", "fetch-subPath"]);
    });
});

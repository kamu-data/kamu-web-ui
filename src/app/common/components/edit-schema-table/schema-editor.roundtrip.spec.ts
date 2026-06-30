/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/**
 * Service-level round-trip integration spec for the schema editor:
 *   Load (GQL stub → service → FormControl)
 *   → Edit (harness UI interactions on SchemaFieldComponent)
 *   → Serialize (buildYamlSetPollingSourceEvent → parse → assert)
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { parse } from "yaml";

import { EditSchemaTableHarness } from "@common/components/edit-schema-table/edit-schema-table.harness";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetApi } from "@api/dataset.api";
import { DatasetBlocksSchemaByEventTypeQuery, MetadataEventType } from "@api/kamu.graphql.interface";
import { DataSchemaField, DatasetSchema, OdfTypes } from "@interface/dataset-schema.interface";

import { SchemaFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.component";
import { schemaValidator } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.component.helpers";
import { SchemaFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.harness";
import {
    FetchKind,
    MergeKind,
    ReadKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

// ---------------------------------------------------------------------------
// Nested ODF_JSON fixture
//
//   root fields:
//     id        Int64
//     address   Struct
//       street  String
//       geo     Struct
//         lat   Float64
//         lng   Float64
// ---------------------------------------------------------------------------

const NESTED_SCHEMA_FIELDS: DataSchemaField[] = [
    { name: "id", type: { kind: OdfTypes.Int64 } },
    {
        name: "address",
        type: {
            kind: OdfTypes.Struct,
            fields: [
                { name: "street", type: { kind: OdfTypes.String } },
                {
                    name: "geo",
                    type: {
                        kind: OdfTypes.Struct,
                        fields: [
                            { name: "lat", type: { kind: OdfTypes.Float64 } },
                            { name: "lng", type: { kind: OdfTypes.Float64 } },
                        ],
                    },
                },
            ],
        },
    },
];

const NESTED_SCHEMA_ODF_JSON = JSON.stringify({ fields: NESTED_SCHEMA_FIELDS });

// ---------------------------------------------------------------------------
// GQL mock builder — mirrors the pattern from block.service.spec.ts
// ---------------------------------------------------------------------------

function mockGqlProjectionWithSchema(schemaContent: string): DatasetBlocksSchemaByEventTypeQuery {
    return {
        datasets: {
            byOwnerAndName: {
                metadata: {
                    metadataProjection: [
                        {
                            __typename: "MetadataBlockExtended",
                            event: {
                                __typename: "SetPollingSource",
                                read: {
                                    __typename: "ReadStepCsv",
                                    schema: {
                                        __typename: "DataSchema",
                                        content: schemaContent,
                                        format: "ODF_JSON" as never,
                                    },
                                } as never,
                                fetch: {} as never,
                                merge: {} as never,
                            },
                        },
                    ],
                },
            },
        },
    } as DatasetBlocksSchemaByEventTypeQuery;
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("Schema editor round-trip (Load → Edit → Serialize)", () => {
    let fixture: ComponentFixture<SchemaFieldComponent>;
    let schemaControl: FormControl<DataSchemaField[]>;
    let harness: SchemaFieldHarness;

    /**
     * Creates the component with an initial schema value set before the first
     * detectChanges, so that OnPush components receive the fields as an @Input
     * from the first render cycle.
     */
    async function setup(initialFields: DataSchemaField[] = []): Promise<void> {
        schemaControl = new FormControl<DataSchemaField[]>(initialFields, { nonNullable: true });
        schemaControl.addValidators(schemaValidator);

        fixture = TestBed.createComponent(SchemaFieldComponent);
        const component = fixture.componentInstance;
        component.form = new FormGroup({ schema: schemaControl });
        component.controlName = "schema";
        fixture.detectChanges();
        await fixture.whenStable();

        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SchemaFieldHarness);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SchemaFieldComponent],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();
    });

    // -------------------------------------------------------------------------
    // Step 1: Load — GQL stub → EditPollingSourceService → FormControl
    // -------------------------------------------------------------------------

    it("patchFormValues populates schemaControl with canonical DataSchemaField[] from a GQL event", async () => {
        await setup();

        const datasetApi = TestBed.inject(DatasetApi);
        const spy = spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(
            of(mockGqlProjectionWithSchema(NESTED_SCHEMA_ODF_JSON)),
        );

        const editPollingSourceService = TestBed.inject(EditPollingSourceService);
        const readForm = new FormGroup({ schema: schemaControl });
        editPollingSourceService.patchFormValues(
            readForm,
            {
                fetch: { kind: FetchKind.URL, url: "" },
                read: { kind: ReadKind.CSV, schema: [] },
                merge: { kind: MergeKind.APPEND },
            },
            SetPollingSourceSection.READ,
            mockDatasetInfo,
        );

        expect(spy).toHaveBeenCalledWith(
            jasmine.objectContaining({ eventTypes: [MetadataEventType.SetPollingSource] }),
        );
        expect(schemaControl.value).toEqual(NESTED_SCHEMA_FIELDS);
    });

    // -------------------------------------------------------------------------
    // Step 2: Edit via harness — add root field + rename a 3-level nested field
    // -------------------------------------------------------------------------

    it("harness edits — add root field and rename a 3-level nested field", async () => {
        await setup(NESTED_SCHEMA_FIELDS);

        // Add a root-level field
        await harness.addField("country");
        fixture.detectChanges();

        // Rename a 3-level deep field: root.address.geo.lat → latitude
        const rootTable = await harness.rootTable();
        const addressTable = await rootTable.nestedTable("address");
        const geoTable = await addressTable.nestedTable("geo");
        await geoTable.renameField("lat", "latitude");
        fixture.detectChanges();

        // Root-level names
        const rootNames = await harness.getFieldNames();
        expect(rootNames).toContain("id");
        expect(rootNames).toContain("address");
        expect(rootNames).toContain("country");

        // Deep rename reflected in the control value
        const fields = schemaControl.value;
        const addressChildren = EditSchemaTableHarness.structFieldsOf(fields, "address");
        const geoChildren = EditSchemaTableHarness.structFieldsOf(addressChildren, "geo");
        expect(geoChildren.map((f) => f.name)).toContain("latitude");
        expect(geoChildren.map((f) => f.name)).not.toContain("lat");

        // Sibling field untouched
        expect(EditSchemaTableHarness.requireField(geoChildren, "lng")).toEqual({
            name: "lng",
            type: { kind: OdfTypes.Float64 },
        });
    });

    // -------------------------------------------------------------------------
    // Step 3: Full round-trip — Load → edit → YAML → parse → assert fields
    // -------------------------------------------------------------------------

    it("full round-trip: Load → edit → buildYamlSetPollingSourceEvent → parse → assert fields", async () => {
        await setup(NESTED_SCHEMA_FIELDS);

        const templateService = TestBed.inject(TemplatesYamlEventsService);

        // Edit: add a root field, rename a nested field
        await harness.addField("tags");
        fixture.detectChanges();

        const rootTable = await harness.rootTable();
        const addressTable = await rootTable.nestedTable("address");
        await addressTable.renameField("street", "road");
        fixture.detectChanges();

        // Serialize
        const currentFields = schemaControl.value;
        const yaml = templateService.buildYamlSetPollingSourceEvent(
            {
                fetch: { kind: FetchKind.URL, url: "http://example.com" },
                read: { kind: ReadKind.CSV, schema: currentFields },
                merge: { kind: MergeKind.APPEND },
            },
            null,
        );

        const parsed = parse(yaml) as { content: { read: { schema: DatasetSchema } } };
        const roundTrippedFields = parsed.content.read.schema.fields;

        // Root fields include the added one
        expect(roundTrippedFields.map((f: DataSchemaField) => f.name)).toContain("tags");
        expect(roundTrippedFields.map((f: DataSchemaField) => f.name)).toContain("id");

        // Nested rename survived serialization
        const addressChildrenInYaml = EditSchemaTableHarness.structFieldsOf(roundTrippedFields, "address");
        expect(addressChildrenInYaml.map((f) => f.name)).toContain("road");
        expect(addressChildrenInYaml.map((f) => f.name)).not.toContain("street");

        // Schema wire shape is { fields } object, not a bare array
        expect(Array.isArray(parsed.content.read.schema)).toBeFalse();
    });
});

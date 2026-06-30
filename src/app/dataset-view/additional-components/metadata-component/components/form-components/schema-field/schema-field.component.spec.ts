/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { EditSchemaTableHarness } from "@common/components/edit-schema-table/edit-schema-table.harness";
import { ORDER_SCHEMA } from "@common/components/edit-schema-table/schema-editor.fixtures.spec";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { SchemaFieldComponent } from "./schema-field.component";
import { SchemaFieldHarness } from "./schema-field.harness";

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("SchemaFieldComponent", () => {
    let fixture: ComponentFixture<SchemaFieldComponent>;
    let component: SchemaFieldComponent;
    let harness: SchemaFieldHarness;

    function schemaControl(): FormControl<DataSchemaField[]> {
        return component.schemaControl;
    }

    async function setup(initialFields: DataSchemaField[] = []): Promise<void> {
        fixture = TestBed.createComponent(SchemaFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({ schema: new FormControl<DataSchemaField[]>(initialFields) });
        component.controlName = "schema";
        fixture.detectChanges();
        await fixture.whenStable();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SchemaFieldHarness);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SchemaFieldComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();
        await setup();
    });

    // ---------------------------------------------------------------------------
    // Basic editing
    // ---------------------------------------------------------------------------

    it("adding a field updates schemaControl.value", async () => {
        await harness.addField("city");
        fixture.detectChanges();
        expect(schemaControl().value.map((f) => f.name)).toContain("city");
    });

    it("adding multiple fields preserves order in schemaControl.value", async () => {
        await harness.addField("id");
        fixture.detectChanges();
        await harness.addField("name");
        fixture.detectChanges();
        expect(schemaControl().value.map((f) => f.name)).toEqual(["id", "name"]);
    });

    // ---------------------------------------------------------------------------
    // Hard errors — control goes invalid
    // ---------------------------------------------------------------------------

    describe("validation errors", () => {
        it("duplicate root-level names make the control invalid and show an error icon", async () => {
            await harness.addField("city");
            fixture.detectChanges();
            await harness.addField("city");
            fixture.detectChanges();

            expect(schemaControl().valid).toBeFalse();
            expect(component.schemaErrors.length).toBeGreaterThan(0);

            const table = await harness.rootTable();
            // The second "city" has a duplicate-name error
            expect(await table.hasErrorIcon("city")).toBeTrue();
        });

        it("empty field name makes the control invalid", () => {
            // Start an add and save without entering a name — save is a no-op,
            // so we inject a bad field directly to test the validator
            const bad: DataSchemaField[] = [{ name: "", type: { kind: OdfTypes.String } }];
            schemaControl().setValue(bad);
            schemaControl().updateValueAndValidity();
            fixture.detectChanges();

            expect(schemaControl().valid).toBeFalse();
            expect(component.schemaErrors.length).toBeGreaterThan(0);
        });

        it("duplicate names inside a List<Struct> surface inside the nested table", async () => {
            const withDupInList: DataSchemaField[] = [
                {
                    name: "items",
                    type: {
                        kind: OdfTypes.List,
                        itemType: {
                            kind: OdfTypes.Struct,
                            fields: [
                                { name: "sku", type: { kind: OdfTypes.String } },
                                { name: "sku", type: { kind: OdfTypes.String } },
                            ],
                        },
                    },
                },
            ];
            schemaControl().setValue(withDupInList);
            schemaControl().updateValueAndValidity();
            fixture.detectChanges();

            expect(schemaControl().valid).toBeFalse();
            expect(component.schemaErrors.length).toBeGreaterThan(0);
            expect(component.schemaErrors[0].path).toEqual(["items", "itemType", "fields", "sku"]);

            const rootTable = await harness.rootTable();
            const itemsTable = await rootTable.nestedTable("items.itemType");
            expect(await itemsTable.hasErrorIcon("sku")).toBeTrue();
        });

        it("duplicate names inside a nested Struct make the control invalid", async () => {
            const withDupInStruct: DataSchemaField[] = [
                {
                    name: "address",
                    type: {
                        kind: OdfTypes.Struct,
                        fields: [
                            { name: "city", type: { kind: OdfTypes.String } },
                            { name: "city", type: { kind: OdfTypes.String } },
                        ],
                    },
                },
            ];
            schemaControl().setValue(withDupInStruct);
            schemaControl().updateValueAndValidity();
            fixture.detectChanges();

            expect(schemaControl().valid).toBeFalse();
            expect(component.schemaErrors.length).toBeGreaterThan(0);

            // The error icon must surface inside the nested table next to the duplicate field,
            // not just invalidate the control silently — regression test for the "fields" path
            // segment inserted by validateSchemaFields not being stripped before being passed down.
            const rootTable = await harness.rootTable();
            const addressTable = await rootTable.nestedTable("address");
            expect(await addressTable.hasErrorIcon("city")).toBeTrue();
        });
    });

    // ---------------------------------------------------------------------------
    // Permissive names — valid
    // ---------------------------------------------------------------------------

    describe("permissive valid names", () => {
        it("a name with spaces is valid", async () => {
            await harness.addField("first name");
            fixture.detectChanges();

            expect(schemaControl().valid).toBeTrue();
            expect(component.schemaErrors.length).toBe(0);
        });
    });

    // ---------------------------------------------------------------------------
    // Warnings — control stays valid
    // ---------------------------------------------------------------------------

    describe("warnings", () => {
        it("event_time field shows a warning icon but control stays valid", async () => {
            await harness.addField("event_time");
            fixture.detectChanges();

            expect(schemaControl().valid).toBeTrue();
            expect(component.schemaWarnings.length).toBeGreaterThan(0);

            const table = await harness.rootTable();
            expect(await table.hasWarningIcon("event_time")).toBeTrue();
        });

        it("a SQL keyword ('select') shows a warning icon but control stays valid", async () => {
            await harness.addField("select");
            fixture.detectChanges();

            expect(schemaControl().valid).toBeTrue();
            expect(component.schemaWarnings.length).toBeGreaterThan(0);

            const table = await harness.rootTable();
            expect(await table.hasWarningIcon("select")).toBeTrue();
        });

        // Scenario 3 — SQL keyword / system-column warning, control valid
        it("scenario 3: system-column name 'op' shows a warning but keeps the control valid", async () => {
            await harness.addField("op");
            fixture.detectChanges();

            expect(schemaControl().valid).toBeTrue();
            const table = await harness.rootTable();
            expect(await table.hasWarningIcon("op")).toBeTrue();
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 4 — duplicate (case variant) → error icon, control invalid
    // ---------------------------------------------------------------------------

    describe("scenario 4: duplicate names (case variants)", () => {
        it("duplicate name in a different case is flagged as an error and invalidates the control", async () => {
            await harness.addField("City");
            fixture.detectChanges();
            await harness.addField("city");
            fixture.detectChanges();

            expect(schemaControl().valid).toBeFalse();
            expect(component.schemaErrors.length).toBeGreaterThan(0);

            // The error icon appears next to at least one of the duplicate fields
            const table = await harness.rootTable();
            const cityError = await table.hasErrorIcon("city");
            const CityError = await table.hasErrorIcon("City");
            expect(cityError || CityError).toBeTrue();
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 5 — 3-level rename leaves sibling Structs untouched
    // ---------------------------------------------------------------------------

    describe("scenario 5: deep rename keeps sibling Structs intact", () => {
        it("renaming customer.address.geo.lat does not affect the shipping Struct", async () => {
            await setup(ORDER_SCHEMA);

            const rootTable = await harness.rootTable();
            const customerTable = await rootTable.nestedTable("customer");
            const addressTable = await customerTable.nestedTable("address");
            const geoTable = await addressTable.nestedTable("geo");
            await geoTable.renameField("lat", "latitude");
            fixture.detectChanges();

            // Renamed field reflected in the control
            const fields = schemaControl().value;
            const customerFields = EditSchemaTableHarness.structFieldsOf(fields, "customer");
            const addressFields = EditSchemaTableHarness.structFieldsOf(customerFields, "address");
            const geoFields = EditSchemaTableHarness.structFieldsOf(addressFields, "geo");
            expect(geoFields.map((f) => f.name)).toContain("latitude");
            expect(geoFields.map((f) => f.name)).not.toContain("lat");

            // shipping Struct untouched
            const shippingFields = EditSchemaTableHarness.structFieldsOf(fields, "shipping");
            expect(shippingFields.map((f) => f.name)).toEqual(["carrier", "tracking"]);

            // Control remains valid after rename
            expect(schemaControl().valid).toBeTrue();
        });
    });
});

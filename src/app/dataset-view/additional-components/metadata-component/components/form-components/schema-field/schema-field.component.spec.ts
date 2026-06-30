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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SchemaFieldComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(SchemaFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({ schema: new FormControl<DataSchemaField[]>([]) });
        component.controlName = "schema";
        fixture.detectChanges();
        await fixture.whenStable();

        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SchemaFieldHarness);
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

        it("duplicate names inside a nested Struct make the control invalid", () => {
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
    });
});

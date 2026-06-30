/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { EditSchemaTableComponent } from "./edit-schema-table.component";
import { EditSchemaTableHarness } from "./edit-schema-table.harness";

// ---------------------------------------------------------------------------
// TestHost
// ---------------------------------------------------------------------------

@Component({
    selector: "app-test-host",
    template: `<app-edit-schema-table [fields]="fields" (fieldsChange)="onFieldsChange($event)" />`,
    imports: [EditSchemaTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
    @Input() public fields: DataSchemaField[] = [];
    @Output() public fieldsChange = new EventEmitter<DataSchemaField[]>();

    public lastEmitted: DataSchemaField[] | null = null;

    public onFieldsChange(fields: DataSchemaField[]): void {
        this.fields = fields;
        this.lastEmitted = fields;
        this.fieldsChange.emit(fields);
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function structField(name: string, nestedFields: DataSchemaField[] = []): DataSchemaField {
    return { name, type: { kind: OdfTypes.Struct, fields: nestedFields } };
}

function stringField(name: string): DataSchemaField {
    return { name, type: { kind: OdfTypes.String } };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("EditSchemaTableComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let loader: HarnessLoader;
    let table: EditSchemaTableHarness;

    async function setup(fields: DataSchemaField[] = []): Promise<void> {
        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        host.fields = fields;
        fixture.detectChanges();
        await fixture.whenStable();
        loader = TestbedHarnessEnvironment.loader(fixture);
        table = await loader.getHarness(EditSchemaTableHarness);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();
        registerMatSvgIcons();
    });

    // ---------------------------------------------------------------------------
    // Add
    // ---------------------------------------------------------------------------

    describe("adding a field", () => {
        it("emits the new field in fieldsChange", async () => {
            await setup();
            await table.addField("city");
            fixture.detectChanges();
            expect(host.lastEmitted).toEqual([jasmine.objectContaining({ name: "city" })]);
        });

        it("empty-name save is a no-op — row count stays the same after cancel", async () => {
            await setup([stringField("id")]);
            await table.startAddField();
            fixture.detectChanges();
            expect(await table.getRowCount()).toBe(2);
            // cancel without entering a name removes the provisional row
            await table.cancel();
            fixture.detectChanges();
            expect(await table.getRowCount()).toBe(1);
            expect(host.lastEmitted).toEqual([stringField("id")]);
        });
    });

    // ---------------------------------------------------------------------------
    // Edit
    // ---------------------------------------------------------------------------

    describe("editing a field", () => {
        it("renaming a field emits the updated array", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.renameField("id", "identifier");
            fixture.detectChanges();
            const names = await table.getFieldNames();
            expect(names).toContain("identifier");
            expect(names).not.toContain("id");
        });

        it("type change on editingRow is reflected in the emitted array", async () => {
            await setup([stringField("ts")]);
            // Open edit mode for "ts"
            await table.editField("ts");
            fixture.detectChanges();
            // Set the type at the component level (contract — no ng-select interaction)
            const editorComponent = fixture.debugElement.query(By.directive(EditSchemaTableComponent))
                .componentInstance as EditSchemaTableComponent;
            editorComponent.typeChangeHandle({ kind: OdfTypes.Int64 });
            fixture.detectChanges();
            await table.save();
            fixture.detectChanges();
            expect(host.lastEmitted?.[0].type).toEqual({ kind: OdfTypes.Int64 });
        });
    });

    // ---------------------------------------------------------------------------
    // Delete
    // ---------------------------------------------------------------------------

    describe("deleting a field", () => {
        it("removes the field and emits the updated array", async () => {
            await setup([stringField("a"), stringField("b"), stringField("c")]);
            await table.deleteField("b");
            fixture.detectChanges();
            const names = await table.getFieldNames();
            expect(names).toEqual(["a", "c"]);
        });
    });

    // ---------------------------------------------------------------------------
    // Nested Struct
    // ---------------------------------------------------------------------------

    describe("nesting a Struct", () => {
        it("adding a field inside a nested Struct updates parent type.fields immutably", async () => {
            // Start with address as a Struct with one child
            const initial: DataSchemaField[] = [stringField("id"), structField("address", [stringField("street")])];
            await setup(initial);

            const nested = await table.nestedTable("address");
            await nested.addField("city");
            fixture.detectChanges();

            const emitted = host.lastEmitted ?? [];
            const nestedFields = EditSchemaTableHarness.structFieldsOf(emitted, "address");
            expect(nestedFields.map((f) => f.name)).toContain("city");
            // sibling field untouched
            expect(EditSchemaTableHarness.requireField(emitted, "id")).toEqual(stringField("id"));
        });

        it("editing a 3-level deep field changes only the deepest field", async () => {
            const geo = structField("geo", [stringField("lat"), stringField("lng")]);
            const address = structField("address", [stringField("street"), geo]);
            await setup([stringField("id"), address]);

            const addressTable = await table.nestedTable("address");
            const geoTable = await addressTable.nestedTable("geo");
            await geoTable.renameField("lat", "latitude");
            fixture.detectChanges();

            // Verify deepest rename
            const emitted = host.lastEmitted ?? [];
            const addressFields = EditSchemaTableHarness.structFieldsOf(emitted, "address");
            const geoFields = EditSchemaTableHarness.structFieldsOf(addressFields, "geo");
            expect(geoFields.map((f) => f.name)).toContain("latitude");
            expect(geoFields.map((f) => f.name)).not.toContain("lat");

            // Siblings untouched
            expect(EditSchemaTableHarness.requireField(emitted, "id")).toEqual(stringField("id"));
            expect(EditSchemaTableHarness.requireField(addressFields, "street")).toEqual(stringField("street"));
        });
    });
});

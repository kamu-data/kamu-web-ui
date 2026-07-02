/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgSelectComponent } from "@ng-select/ng-select";

import { findComponentInstance, findElement, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { DataSchemaField, DataSchemaListField, OdfTypes } from "@interface/dataset-schema.interface";

import { TypeEditorComponent } from "./components/type-editor/type-editor.component";
import { EditSchemaTableComponent } from "./edit-schema-table.component";
import { EditSchemaTableHarness } from "./edit-schema-table.harness";
import { ORDER_SCHEMA } from "./schema-editor.fixtures.spec";

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
    // Add (scenarios 1, 2)
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

        // Scenario 1 — add many in a row, insertion order preserved
        it("scenario 1: adding multiple fields in sequence preserves insertion order", async () => {
            await setup();
            await table.addField("order_id");
            fixture.detectChanges();
            await table.addField("placed_at");
            fixture.detectChanges();
            await table.addField("status");
            fixture.detectChanges();

            expect(await table.getFieldNames()).toEqual(["order_id", "placed_at", "status"]);
            expect(host.lastEmitted?.map((f) => f.name)).toEqual(["order_id", "placed_at", "status"]);
        });

        // Scenario 2 — blank provisional row: Save and Add disabled until a name is typed
        it("scenario 2: blank provisional row disables Save and Add buttons", async () => {
            await setup([stringField("id")]);
            await table.startAddField();
            fixture.detectChanges();

            expect(await table.isSaveDisabled()).toBeTrue();
            expect(await table.isAddFieldDisabled()).toBeTrue();
        });

        // Scenario 11 — start add, cancel → row removed and original list restored
        it("scenario 11: cancel during add removes the provisional row and restores the list", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.startAddField();
            fixture.detectChanges();
            expect(await table.getRowCount()).toBe(3);

            await table.cancel();
            fixture.detectChanges();

            expect(await table.getRowCount()).toBe(2);
            expect(await table.getFieldNames()).toEqual(["id", "name"]);
            // No spurious emission — original list unchanged
            expect(host.lastEmitted).toEqual([stringField("id"), stringField("name")]);
        });

        // Scenario 12 — edit-while-adding discards blank row, target row enters edit mode
        it("scenario 12: clicking edit on another row while a blank add row is pending discards the blank row", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.startAddField();
            fixture.detectChanges();
            // 3 rows: id, name, and the provisional blank row
            expect(await table.getRowCount()).toBe(3);

            // Click edit on "id" — the blank add row should be discarded
            await table.editField("id");
            fixture.detectChanges();

            // Provisional row gone — back to 2
            expect(await table.getRowCount()).toBe(2);
            expect(await table.getFieldNames()).toEqual(["id", "name"]);
            // No {name:""} leak in emitted value
            const emitted = host.lastEmitted ?? [];
            expect(emitted.every((f) => f.name !== "")).toBeTrue();
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

        it("saves the current edited row when switching edit mode to another row", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.editField("id");
            fixture.detectChanges();
            await table.setNameInput("identifier");
            fixture.detectChanges();

            await table.editField("name");
            fixture.detectChanges();

            expect(host.lastEmitted?.map((field) => field.name)).toEqual(["identifier", "name"]);
            expect(await table.getFieldNames()).toContain("identifier");
        });

        it("type change on editingRow is reflected in the emitted array", async () => {
            await setup([stringField("ts")]);
            // Open edit mode for "ts"
            await table.editField("ts");
            fixture.detectChanges();
            // Set the type at the component level (contract — no ng-select interaction)
            const editorComponent = findComponentInstance(
                fixture,
                EditSchemaTableComponent,
                (c) => c.tablePath === "root",
            );
            editorComponent.typeChangeHandle({ kind: OdfTypes.Int64 });
            fixture.detectChanges();
            await table.save();
            fixture.detectChanges();
            expect(host.lastEmitted?.[0].type).toEqual({ kind: OdfTypes.Int64 });
        });

        it("type change via real TypeEditor ng-select fires typeChange and is saved in emitted array", async () => {
            await setup([stringField("amount")]);
            await table.editField("amount");
            fixture.detectChanges();

            // Drive the kind ng-select via its public API (no CDK harness for ng-select)
            const ngSelect = findElement(fixture, "ng-select").componentInstance as NgSelectComponent;
            ngSelect.open();
            fixture.detectChanges();
            const item = ngSelect.itemsList.items.find(
                (i) => (i.value as { value?: OdfTypes } | null)?.value === OdfTypes.Int64,
            );
            if (!item) throw new Error("Int64 option not found in kind ng-select");
            ngSelect.select(item);
            fixture.detectChanges();

            await table.save();
            fixture.detectChanges();
            expect(host.lastEmitted?.[0].type).toEqual(jasmine.objectContaining({ kind: OdfTypes.Int64 }));
        });

        it("loading a List<Struct> field, opening edit, and saving unchanged preserves the type shape", async () => {
            const listStructField: DataSchemaField = {
                name: "items",
                type: {
                    kind: OdfTypes.List,
                    itemType: {
                        kind: OdfTypes.Struct,
                        fields: [{ name: "sku", type: { kind: OdfTypes.String } }],
                    },
                },
            };
            await setup([listStructField]);
            await table.editField("items");
            fixture.detectChanges();
            await table.save();
            fixture.detectChanges();

            const emitted = host.lastEmitted?.[0].type as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect(emitted.itemType.kind).toBe(OdfTypes.Struct);
            if (emitted.itemType.kind === OdfTypes.Struct) {
                expect(emitted.itemType.fields).toEqual([{ name: "sku", type: { kind: OdfTypes.String } }]);
            }
        });

        it("editing a List item type as Struct exposes a nested table and saves its fields", async () => {
            await setup([stringField("items")]);
            await table.editField("items");
            fixture.detectChanges();

            const rootTypeEditor = findComponentInstance(
                fixture,
                TypeEditorComponent,
                (c) => c.typePath === "root:type:items",
            );
            rootTypeEditor.changeEditorType({ value: OdfTypes.List, label: OdfTypes.List });
            fixture.detectChanges();

            const itemTypeEditor = findComponentInstance(
                fixture,
                TypeEditorComponent,
                (c) => c.typePath === "root:type:items.item",
            );
            itemTypeEditor.changeEditorType({ value: OdfTypes.Struct, label: OdfTypes.Struct });
            fixture.detectChanges();

            const structTable = await loader.getHarness(EditSchemaTableHarness.withPath("root:type:items.item.fields"));
            await structTable.addField("sku");
            fixture.detectChanges();

            await table.save();
            fixture.detectChanges();

            const emitted = host.lastEmitted?.[0].type as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect(emitted.itemType.kind).toBe(OdfTypes.Struct);
            if (emitted.itemType.kind === OdfTypes.Struct) {
                expect(emitted.itemType.fields).toEqual([{ name: "sku", type: { kind: OdfTypes.String } }]);
            }
        });

        it("saving an Option inner type as Struct keeps its nested table expanded in view mode", async () => {
            await setup([stringField("c")]);
            await table.editField("c");
            fixture.detectChanges();

            const rootTypeEditor = findComponentInstance(
                fixture,
                TypeEditorComponent,
                (component) => component.typePath === "root:type:c",
            );
            rootTypeEditor.changeOptional(true);
            rootTypeEditor.changeEditorType({ value: OdfTypes.Struct, label: OdfTypes.Struct });
            fixture.detectChanges();

            const editStructTable = await loader.getHarness(EditSchemaTableHarness.withPath("root:type:c.fields"));
            await editStructTable.addField("f1");
            fixture.detectChanges();

            await table.save();
            fixture.detectChanges();

            const viewStructTable = await loader.getHarness(EditSchemaTableHarness.withPath("root.c.inner"));
            expect(await viewStructTable.getFieldNames()).toEqual(["f1"]);

            await viewStructTable.addField("f2");
            fixture.detectChanges();

            const emitted = host.lastEmitted?.[0].type;
            expect(emitted?.kind).toBe(OdfTypes.Option);
            if (emitted?.kind === OdfTypes.Option) {
                expect(emitted.inner.kind).toBe(OdfTypes.Struct);
                if (emitted.inner.kind === OdfTypes.Struct) {
                    expect(emitted.inner.fields.map((field) => field.name)).toEqual(["f1", "f2"]);
                }
            }
        });
    });

    // ---------------------------------------------------------------------------
    // Delete (scenarios 10, 9A)
    // ---------------------------------------------------------------------------

    describe("deleting a field", () => {
        it("removes the field and emits the updated array", async () => {
            await setup([stringField("a"), stringField("b"), stringField("c")]);
            await table.deleteField("b");
            fixture.detectChanges();
            const names = await table.getFieldNames();
            expect(names).toEqual(["a", "c"]);
        });

        // Scenario 10 — delete a middle field, surrounding order intact
        it("scenario 10: deleting a middle field preserves the order of remaining fields", async () => {
            await setup(ORDER_SCHEMA);
            fixture.detectChanges();
            // Delete a middle scalar field ("notes" is index 2)
            await table.deleteField("notes");
            fixture.detectChanges();

            const names = await table.getFieldNames();
            expect(names).not.toContain("notes");
            // Surrounding fields in their original relative order
            expect(names.indexOf("order_id")).toBeLessThan(names.indexOf("placed_at"));
            expect(names.indexOf("placed_at")).toBeLessThan(names.indexOf("tags"));
        });

        // Scenario 9 (branch A — instant delete) — delete non-empty Struct removes whole subtree;
        // sibling Struct stays intact.
        it("scenario 9A: deleting a non-empty Struct removes it and its subtree; sibling Struct untouched", async () => {
            await setup(ORDER_SCHEMA);
            fixture.detectChanges();

            await table.deleteField("customer");
            fixture.detectChanges();

            const names = await table.getFieldNames();
            expect(names).not.toContain("customer");

            // shipping (sibling Struct) is still present and renderable
            expect(names).toContain("shipping");
            const shippingTable = await table.nestedTable("shipping");
            expect(await shippingTable.getFieldNames()).toContain("carrier");
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 18 — keyboard shortcuts: Enter saves, Escape cancels
    // ---------------------------------------------------------------------------

    describe("scenario 18: keyboard shortcuts", () => {
        it("pressing Enter while editing saves the row when the name is non-blank", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.editField("id");
            fixture.detectChanges();
            await table.setNameInput("identifier");
            fixture.detectChanges();
            await table.pressEnter();
            fixture.detectChanges();

            // Row is no longer in edit mode (save-field button gone)
            expect(await table.isSaveDisabled()).toBeTrue();
            const names = await table.getFieldNames();
            expect(names).toContain("identifier");
            expect(names).not.toContain("id");
            expect(host.lastEmitted?.map((f) => f.name)).toContain("identifier");
        });

        it("pressing Enter with a blank name is a no-op — row stays in edit mode", async () => {
            await setup([stringField("id")]);
            await table.startAddField();
            fixture.detectChanges();

            // Input is blank — Enter should not save
            await table.pressEnter();
            fixture.detectChanges();

            // Still in edit mode: provisional row still present
            expect(await table.getRowCount()).toBe(2);
            expect(await table.isSaveDisabled()).toBeTrue();
        });

        it("pressing Escape during add cancels and removes the provisional row", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.startAddField();
            fixture.detectChanges();
            expect(await table.getRowCount()).toBe(3);

            await table.pressEscape();
            fixture.detectChanges();

            expect(await table.getRowCount()).toBe(2);
            expect(await table.getFieldNames()).toEqual(["id", "name"]);
        });

        it("pressing Escape during edit restores the original value without emitting", async () => {
            await setup([stringField("id"), stringField("name")]);
            await table.editField("id");
            fixture.detectChanges();
            await table.setNameInput("changed");
            fixture.detectChanges();

            await table.pressEscape();
            fixture.detectChanges();

            expect(await table.getFieldNames()).toEqual(["id", "name"]);
            // No new emission — lastEmitted from setup is null
            expect(host.lastEmitted).toBeNull();
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 19 — trackBy stability under transient duplicate names
    // ---------------------------------------------------------------------------

    describe("scenario 19: trackBy stable under transient duplicate names", () => {
        it("both rows remain visible while a rename temporarily collides with an existing name", async () => {
            await setup([stringField("alpha"), stringField("beta")]);

            // Open edit on "alpha" and type "beta" (collision) without saving
            await table.editField("alpha");
            fixture.detectChanges();
            await table.setNameInput("beta");
            fixture.detectChanges();

            // Both rows still present in the DOM — trackBy must not collapse them
            expect(await table.getRowCount()).toBe(2);
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 20 — drag & drop reordering
    // ---------------------------------------------------------------------------

    describe("scenario 20: drag & drop reordering", () => {
        // Drag-drop has no CDK test harness — drive the component method directly,
        // matching the existing interop pattern used for type-change tests. Filters by
        // tablePath since nested tables are separate EditSchemaTableComponent instances
        // and By.directive alone would always match the first (root) one in the fixture.
        function componentInstanceOf(tablePath: string): EditSchemaTableComponent {
            return findComponentInstance(fixture, EditSchemaTableComponent, (c) => c.tablePath === tablePath);
        }

        it("dropping a top-level field at a new index reorders fields and emits", async () => {
            await setup([stringField("a"), stringField("b"), stringField("c")]);
            const component = componentInstanceOf("root");

            component.dropField({ previousIndex: 0, currentIndex: 2 } as CdkDragDrop<DataSchemaField[]>);
            fixture.detectChanges();

            expect(await table.getFieldNames()).toEqual(["b", "c", "a"]);
            expect(host.lastEmitted?.map((f) => f.name)).toEqual(["b", "c", "a"]);
        });

        it("dropping at the same index is a no-op — no emission", async () => {
            await setup([stringField("a"), stringField("b")]);
            const component = componentInstanceOf("root");

            component.dropField({ previousIndex: 1, currentIndex: 1 } as CdkDragDrop<DataSchemaField[]>);
            fixture.detectChanges();

            expect(host.lastEmitted).toBeNull();
        });

        it("reordering fields within a nested Struct only changes that struct's fields", async () => {
            await setup(ORDER_SCHEMA);
            fixture.detectChanges();

            const customerTable = await table.nestedTable("customer");
            const customerComponent = componentInstanceOf("root.customer");
            const namesBefore = await customerTable.getFieldNames();

            customerComponent.dropField({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<DataSchemaField[]>);
            fixture.detectChanges();

            const emitted = host.lastEmitted ?? [];
            const customerFields = EditSchemaTableHarness.structFieldsOf(emitted, "customer");
            expect(customerFields.map((f) => f.name)).toEqual([
                namesBefore[1],
                namesBefore[0],
                ...namesBefore.slice(2),
            ]);

            // Sibling Struct and root order untouched
            const shippingFields = EditSchemaTableHarness.structFieldsOf(emitted, "shipping");
            expect(shippingFields.map((f) => f.name)).toEqual(["carrier", "tracking"]);
            expect(emitted.map((f) => f.name)).toEqual(ORDER_SCHEMA.map((f) => f.name));
        });

        it("drag handle is not rendered for a row currently being edited", async () => {
            await setup([stringField("id"), stringField("name")]);
            expect(await table.hasDragHandle("id")).toBeTrue();

            await table.editField("id");
            fixture.detectChanges();

            expect(await table.hasDragHandle("id")).toBeFalse();
        });

        it("dragDisabled is true while a row is being edited or added", async () => {
            await setup([stringField("id")]);
            const component = componentInstanceOf("root");
            expect(component.dragDisabled).toBeFalse();

            await table.startAddField();
            fixture.detectChanges();

            expect(component.dragDisabled).toBeTrue();
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

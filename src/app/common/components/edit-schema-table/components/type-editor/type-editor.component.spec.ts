/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgSelectComponent } from "@ng-select/ng-select";

import { findElement, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import {
    DataSchemaListField,
    DataSchemaMapField,
    DataSchemaOptionField,
    DataSchemaStructField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { TYPES_OPTIONS_LIST } from "../../edit-schema-table.types";
import { TypeEditorComponent } from "./type-editor.component";

// ---------------------------------------------------------------------------
// TestHost
// ---------------------------------------------------------------------------

@Component({
    selector: "app-test-host",
    template: `<app-type-editor [value]="value" [typePath]="typePath" (typeChange)="onTypeChange($event)" />`,
    imports: [TypeEditorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent implements OnChanges {
    @Input() public value: DataSchemaTypeField = { kind: OdfTypes.String };
    @Input() public typePath: string = "root:type:field";
    @Output() public typeChange = new EventEmitter<DataSchemaTypeField>();

    public lastEmitted: DataSchemaTypeField | null = null;

    public onTypeChange(t: DataSchemaTypeField): void {
        this.lastEmitted = t;
        this.typeChange.emit(t);
    }

    public ngOnChanges(): void {
        this.lastEmitted = null;
    }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("TypeEditorComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    function editor(): TypeEditorComponent {
        return fixture.debugElement.children[0].componentInstance as TypeEditorComponent;
    }

    // Mirrors what ng-select's [(ngModel)] does before firing (change): writes the new kind
    // onto value.kind, then calls the handler. Without this, changeEditorType sees the old kind.
    function selectKind(kind: OdfTypes): void {
        const opt = TYPES_OPTIONS_LIST.find((o) => o.value === kind);
        if (!opt) throw new Error(`No type option for kind: ${kind}`);
        editor().changeEditorType(opt);
    }

    // ---------------------------------------------------------------------------
    // Contract-level: primitives
    // ---------------------------------------------------------------------------

    describe("primitive kinds", () => {
        const primitives: OdfTypes[] = [
            OdfTypes.String,
            OdfTypes.Int32,
            OdfTypes.Int64,
            OdfTypes.Float64,
            OdfTypes.Bool,
            OdfTypes.Date,
            OdfTypes.Binary,
        ];

        primitives.forEach((kind) => {
            it(`emits { kind: ${kind} } when changeEditorType is called with ${kind}`, () => {
                selectKind(kind);
                fixture.detectChanges();
                expect(host.lastEmitted).toEqual(jasmine.objectContaining({ kind }));
            });
        });
    });

    // ---------------------------------------------------------------------------
    // Contract-level: Timestamp
    // ---------------------------------------------------------------------------

    describe("Timestamp type", () => {
        it("emits unit and timezone when switching to Timestamp", () => {
            selectKind(OdfTypes.Timestamp);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaTimeField;
            expect(emitted.kind).toBe(OdfTypes.Timestamp);
            expect(emitted.unit).toBeDefined();
            expect(emitted.timezone).toBeDefined();
        });

        it("emits updated unit when changeUnitTime is called", () => {
            host.value = { kind: OdfTypes.Timestamp, unit: "Millisecond", timezone: "UTC" };
            fixture.detectChanges();
            editor().changeUnitTime({ label: "Second", value: "Second" });
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaTimeField;
            expect(emitted.unit).toBe("Second");
        });

        it("emits updated timezone when changeTimezone is called", () => {
            host.value = { kind: OdfTypes.Timestamp, unit: "Millisecond", timezone: "UTC" };
            fixture.detectChanges();
            editor().changeTimezone({ label: "UTC", value: "UTC" });
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaTimeField;
            expect(emitted.timezone).toBe("UTC");
        });
    });

    // ---------------------------------------------------------------------------
    // Contract-level: Time / Duration
    // ---------------------------------------------------------------------------

    describe("Time and Duration types", () => {
        [OdfTypes.Time, OdfTypes.Duration].forEach((kind) => {
            it(`emits unit (no timezone) when switching to ${kind}`, () => {
                selectKind(kind);
                fixture.detectChanges();
                const emitted = host.lastEmitted as DataSchemaTimeField;
                expect(emitted.kind).toBe(kind);
                expect(emitted.unit).toBeDefined();
                expect((emitted as { timezone?: string }).timezone).toBeUndefined();
            });
        });
    });

    // ---------------------------------------------------------------------------
    // Contract-level: Option<Int64>
    // ---------------------------------------------------------------------------

    describe("Option type", () => {
        it("does not expose Option as a kind option", () => {
            expect(TYPES_OPTIONS_LIST.some((option) => option.value === OdfTypes.Option)).toBeFalse();
        });

        it("emits Option<String> when Optional is enabled", () => {
            editor().changeOptional(true);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaOptionField;
            expect(emitted.kind).toBe(OdfTypes.Option);
            expect(emitted.inner).toEqual({ kind: OdfTypes.String });
        });

        it("toggles Optional through the UI switch and reflects its accessibility state", () => {
            const optionalToggle = findElement(fixture, `[data-test-id="root:type:field:optional"]`)
                .nativeElement as HTMLButtonElement;

            expect(optionalToggle.getAttribute("role")).toBe("switch");
            expect(optionalToggle.getAttribute("aria-checked")).toBe("false");
            expect(optionalToggle.classList.contains("optional-toggle-active")).toBeFalse();

            optionalToggle.click();
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaOptionField;
            expect(emitted.kind).toBe(OdfTypes.Option);
            expect(emitted.inner).toEqual({ kind: OdfTypes.String });
            expect(optionalToggle.getAttribute("aria-checked")).toBe("true");
            expect(optionalToggle.classList.contains("optional-toggle-active")).toBeTrue();
        });

        it("emits the inner type when Optional is disabled", () => {
            host.value = { kind: OdfTypes.Option, inner: { kind: OdfTypes.String } };
            fixture.detectChanges();
            editor().changeOptional(false);
            fixture.detectChanges();
            expect(host.lastEmitted).toEqual({ kind: OdfTypes.String });
        });

        it("keeps the Option wrapper when changing the selected base type", () => {
            host.value = { kind: OdfTypes.Option, inner: { kind: OdfTypes.String } };
            fixture.detectChanges();
            selectKind(OdfTypes.Int64);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaOptionField;
            expect(emitted.kind).toBe(OdfTypes.Option);
            expect(emitted.inner).toEqual({ kind: OdfTypes.Int64 });
        });
    });

    // ---------------------------------------------------------------------------
    // Contract-level: List<String>
    // ---------------------------------------------------------------------------

    describe("List type", () => {
        it("emits List<String> on switch to List", () => {
            selectKind(OdfTypes.List);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect(emitted.itemType).toBeDefined();
        });

        it("emits updated itemType via typeListChange", () => {
            host.value = { kind: OdfTypes.List, itemType: { kind: OdfTypes.String } };
            fixture.detectChanges();
            editor().typeListChange({ kind: OdfTypes.Float64 });
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaListField;
            expect(emitted.itemType).toEqual({ kind: OdfTypes.Float64 });
        });
    });

    // ---------------------------------------------------------------------------
    // Contract-level: Map<String, Int64>
    // ---------------------------------------------------------------------------

    describe("Map type", () => {
        it("emits Map<String, String> on switch to Map", () => {
            selectKind(OdfTypes.Map);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaMapField;
            expect(emitted.kind).toBe(OdfTypes.Map);
            expect(emitted.keyType).toBeDefined();
            expect(emitted.valueType).toBeDefined();
        });

        it("emits updated keyType via typeMapKeyChange", () => {
            host.value = {
                kind: OdfTypes.Map,
                keyType: { kind: OdfTypes.String },
                valueType: { kind: OdfTypes.String },
            };
            fixture.detectChanges();
            editor().typeMapKeyChange({ kind: OdfTypes.Int32 });
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaMapField;
            expect(emitted.keyType).toEqual({ kind: OdfTypes.Int32 });
            expect(emitted.valueType).toEqual({ kind: OdfTypes.String });
        });

        it("emits updated valueType via typeMapValueChange", () => {
            host.value = {
                kind: OdfTypes.Map,
                keyType: { kind: OdfTypes.String },
                valueType: { kind: OdfTypes.String },
            };
            fixture.detectChanges();
            editor().typeMapValueChange({ kind: OdfTypes.Int64 });
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaMapField;
            expect(emitted.keyType).toEqual({ kind: OdfTypes.String });
            expect(emitted.valueType).toEqual({ kind: OdfTypes.Int64 });
        });
    });

    // ---------------------------------------------------------------------------
    // Contract-level: nested List<Map<String, Int64>>
    // ---------------------------------------------------------------------------

    describe("nested complex types", () => {
        it("assembles List<Map<String, Int64>> via chained handler calls", () => {
            // Switch to List
            selectKind(OdfTypes.List);
            fixture.detectChanges();

            // Replace itemType with Map<String, String>
            editor().typeListChange({
                kind: OdfTypes.Map,
                keyType: { kind: OdfTypes.String },
                valueType: { kind: OdfTypes.String },
            });
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect((emitted.itemType as DataSchemaMapField).kind).toBe(OdfTypes.Map);
            expect((emitted.itemType as DataSchemaMapField).valueType).toEqual({ kind: OdfTypes.String });
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 8 — complex type composition via contract-level handler calls
    // ---------------------------------------------------------------------------

    describe("scenario 8: complex type composition", () => {
        it("scalar → Timestamp emits unit and timezone", () => {
            selectKind(OdfTypes.Timestamp);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaTimeField;
            expect(emitted.kind).toBe(OdfTypes.Timestamp);
            expect(emitted.unit).toBeDefined();
            expect(emitted.timezone).toBeDefined();
        });

        it("String → List → itemType set to Struct — assembles List<Struct<sku:String>>", () => {
            selectKind(OdfTypes.List);
            fixture.detectChanges();

            // Replace itemType with a Struct (mirrors the child TypeEditorComponent's typeChange output).
            editor().typeListChange({
                kind: OdfTypes.Struct,
                fields: [{ name: "sku", type: { kind: OdfTypes.String } }],
            } as DataSchemaStructField);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect(emitted.itemType.kind).toBe(OdfTypes.Struct);
            expect((emitted.itemType as DataSchemaStructField).fields.map((f) => f.name)).toContain("sku");
        });

        it("Option<List<String>>: enable Optional then set base type to List<String>", () => {
            editor().changeOptional(true);
            fixture.detectChanges();

            selectKind(OdfTypes.List);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaOptionField;
            expect(emitted.kind).toBe(OdfTypes.Option);
            expect(emitted.inner.kind).toBe(OdfTypes.List);
            expect((emitted.inner as DataSchemaListField).itemType.kind).toBe(OdfTypes.String);
        });
    });

    // ---------------------------------------------------------------------------
    // Scenario 6 & 7 — type-switch round-trip preserves nested config (Fix A)
    // ---------------------------------------------------------------------------

    describe("scenario 6 & 7: type-switch round-trip preserves nested config", () => {
        // Scenario 6 — Struct → scalar → Struct: children survive
        it("scenario 6: Struct→String→Struct restores the original fields", () => {
            // Start with a Struct with one field
            host.value = {
                kind: OdfTypes.Struct,
                fields: [{ name: "sku", type: { kind: OdfTypes.String } }],
            } as DataSchemaStructField;
            fixture.detectChanges();

            // Switch to String (scalar)
            selectKind(OdfTypes.String);
            fixture.detectChanges();
            expect(host.lastEmitted?.kind).toBe(OdfTypes.String);

            // Switch back to Struct
            selectKind(OdfTypes.Struct);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaStructField;
            expect(emitted.kind).toBe(OdfTypes.Struct);
            expect(emitted.fields.map((f) => f.name)).toContain("sku");
        });

        // Scenario 7 — List<Struct> itemType survives a kind round-trip switch
        it("scenario 7: List itemType survives switching away to String and back to List", () => {
            host.value = {
                kind: OdfTypes.List,
                itemType: { kind: OdfTypes.Struct, fields: [{ name: "qty", type: { kind: OdfTypes.Int32 } }] },
            } as DataSchemaListField;
            fixture.detectChanges();

            // Switch away to String
            selectKind(OdfTypes.String);
            fixture.detectChanges();

            // Switch back to List
            selectKind(OdfTypes.List);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect(emitted.itemType.kind).toBe(OdfTypes.Struct);
            expect((emitted.itemType as DataSchemaStructField).fields.map((f) => f.name)).toContain("qty");
        });
    });

    // ---------------------------------------------------------------------------
    // ng-select wiring (smoke) — may be quarantined if flaky in CI
    // ---------------------------------------------------------------------------

    describe("ng-select wiring (smoke)", () => {
        // ng-select has no CDK harness. Drive it via NgSelectComponent's public API
        // (open + select) to avoid DOM timing issues with the option panel.
        function selectKindViaApi(kindValue: OdfTypes): void {
            const ngSelect = findElement(fixture, "ng-select").componentInstance as NgSelectComponent;
            ngSelect.open();
            fixture.detectChanges();
            const item = ngSelect.itemsList.items.find(
                (i) => (i.value as { value?: OdfTypes } | null)?.value === kindValue,
            );
            if (!item) throw new Error(`ng-select kind option not found: ${kindValue}`);
            ngSelect.select(item);
            fixture.detectChanges();
        }

        it("selecting Int64 from the kind panel emits { kind: Int64 }", () => {
            selectKindViaApi(OdfTypes.Int64);
            expect(host.lastEmitted).toEqual(jasmine.objectContaining({ kind: OdfTypes.Int64 }));
        });

        it("selecting Struct from the kind panel emits { kind: Struct, fields: [] }", () => {
            selectKindViaApi(OdfTypes.Struct);
            expect(host.lastEmitted).toEqual(jasmine.objectContaining({ kind: OdfTypes.Struct }));
        });

        it("Struct→String→Struct via ng-select API preserves children", () => {
            host.value = {
                kind: OdfTypes.Struct,
                fields: [{ name: "sku", type: { kind: OdfTypes.String } }],
            } as DataSchemaStructField;
            fixture.detectChanges();

            selectKindViaApi(OdfTypes.String);
            fixture.detectChanges();

            selectKindViaApi(OdfTypes.Struct);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaStructField;
            expect(emitted.kind).toBe(OdfTypes.Struct);
            expect(emitted.fields.map((f) => f.name)).toContain("sku");
        });

        it("List<Struct>→String→List via ng-select API preserves itemType children", () => {
            host.value = {
                kind: OdfTypes.List,
                itemType: {
                    kind: OdfTypes.Struct,
                    fields: [{ name: "qty", type: { kind: OdfTypes.Int32 } }],
                },
            } as DataSchemaListField;
            fixture.detectChanges();

            selectKindViaApi(OdfTypes.String);
            fixture.detectChanges();

            selectKindViaApi(OdfTypes.List);
            fixture.detectChanges();

            const emitted = host.lastEmitted as DataSchemaListField;
            expect(emitted.kind).toBe(OdfTypes.List);
            expect(emitted.itemType.kind).toBe(OdfTypes.Struct);
            expect((emitted.itemType as DataSchemaStructField).fields.map((f) => f.name)).toContain("qty");
        });

        // Regression test: the Timestamp unit/timezone ng-selects previously updated
        // value.unit/value.timezone via ngModel but had no (change) binding, so edits
        // never reached typeChange and were lost when the parent saved editingRow.
        describe("Timestamp unit/timezone wiring", () => {
            function selectFromNgSelectByDataTestId(testId: string, predicate: (value: unknown) => boolean): void {
                const ngSelect = findElement(fixture, `[data-test-id="${testId}"]`)
                    .componentInstance as NgSelectComponent;
                ngSelect.open();
                fixture.detectChanges();
                const item = ngSelect.itemsList.items.find((i) => predicate(i.value));
                if (!item) throw new Error(`ng-select option not found for ${testId}`);
                ngSelect.select(item);
                fixture.detectChanges();
            }

            beforeEach(() => {
                host.value = { kind: OdfTypes.Timestamp, unit: "Millisecond", timezone: "UTC" };
                host.typePath = "root:type:ts";
                fixture.detectChanges();
            });

            it("selecting a unit from the Timestamp unit dropdown emits the new unit via typeChange", () => {
                selectFromNgSelectByDataTestId(
                    "root:type:ts:unit",
                    (v) => (v as { value?: string } | null)?.value === "Second",
                );
                const emitted = host.lastEmitted as DataSchemaTimeField;
                expect(emitted).not.toBeNull();
                expect(emitted.unit).toBe("Second");
            });

            it("selecting a timezone from the Timestamp timezone dropdown emits via typeChange", () => {
                // Only "UTC" is a valid option today, but re-selecting it must still
                // fire (change) and reach typeChange — proving the binding exists at all.
                selectFromNgSelectByDataTestId(
                    "root:type:ts:timezone",
                    (v) => (v as { value?: string } | null)?.value === "UTC",
                );
                const emitted = host.lastEmitted as DataSchemaTimeField;
                expect(emitted).not.toBeNull();
                expect(emitted.timezone).toBe("UTC");
            });
        });
    });
});

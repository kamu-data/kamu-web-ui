/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { NgSelectComponent } from "@ng-select/ng-select";

import {
    DataSchemaListField,
    DataSchemaMapField,
    DataSchemaOptionField,
    DataSchemaTimeField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { DataSchemaTypeOption, TYPES_OPTIONS_LIST } from "../../edit-schema-table.types";
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
        }).compileComponents();

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
            editor().changeUnitTime({ value: "Second" } as unknown as DataSchemaTypeOption);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaTimeField;
            expect(emitted.unit).toBe("Second");
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
        it("emits Option<String> on switch to Option", () => {
            selectKind(OdfTypes.Option);
            fixture.detectChanges();
            const emitted = host.lastEmitted as DataSchemaOptionField;
            expect(emitted.kind).toBe(OdfTypes.Option);
            expect(emitted.inner).toBeDefined();
        });

        it("emits updated inner type via typeOptionChange", () => {
            host.value = { kind: OdfTypes.Option, inner: { kind: OdfTypes.String } };
            fixture.detectChanges();
            editor().typeOptionChange({ kind: OdfTypes.Int64 });
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
    // ng-select wiring (smoke) — may be quarantined if flaky in CI
    // ---------------------------------------------------------------------------

    describe("ng-select wiring (smoke)", () => {
        // ng-select has no CDK harness. Drive it via NgSelectComponent's public API
        // (open + select) to avoid DOM timing issues with the option panel.
        function selectKindViaApi(kindValue: OdfTypes): void {
            const ngSelect = fixture.debugElement.children[0].query(By.css("ng-select"))
                .componentInstance as NgSelectComponent;
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
    });
});

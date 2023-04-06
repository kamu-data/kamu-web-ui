import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { BaseField } from "../base-field";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTable } from "@angular/material/table";

export interface SchemaType {
    name: string;
    type: string;
}

@Component({
    selector: "app-schema-field",
    templateUrl: "./schema-field.component.html",
    styleUrls: ["./schema-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaFieldComponent extends BaseField {
    public displayedColumns: string[] = ["name", "type", "actions"];
    public availableTypes = ["STRING", "BIGINT", "TIMESTAMP"];
    private defaultType = "STRING";
    @ViewChild("table") table: MatTable<unknown>;

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public addRow(): void {
        this.items.push(
            new FormGroup({
                name: new FormControl(""),
                type: new FormControl(this.defaultType),
            }),
        );
        this.table.renderRows();
    }

    public deleteRow(index: number): void {
        this.items.removeAt(index);
        this.table.renderRows();
    }
}

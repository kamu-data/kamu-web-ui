import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { BaseField } from "../base-field";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { MatTable } from "@angular/material/table";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

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
    @ViewChild(MatTable) table: MatTable<unknown>;

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

    public drag(event: CdkDragDrop<SchemaType[]>) {
        this.moveItemInFormArray(
            this.items,
            event.previousIndex,
            event.currentIndex,
        );
        this.table.renderRows();
    }

    private moveItemInFormArray(
        formArray: FormArray,
        fromIndex: number,
        toIndex: number,
    ): void {
        const dir = toIndex > fromIndex ? 1 : -1;
        const item = formArray.at(fromIndex);
        for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
            const current = formArray.at(i + dir);
            formArray.setControl(i, current);
        }
        formArray.setControl(toIndex, item);
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { MaybeNull } from "@interface/app.types";
import {
    DataSchemaField,
    DataSchemaStructField,
    DataSchemaTypeField,
    OdfTypes,
} from "@interface/dataset-schema.interface";

import { SchemaField } from "../edit-schema-table.types";

@Injectable({
    providedIn: "root",
})
export class EditSchemaTableService {
    private dataRowsSubject = new BehaviorSubject<DataSchemaField[]>([]);
    public dataRows$: Observable<DataSchemaField[]> = this.dataRowsSubject.asObservable();

    public editingRow: MaybeNull<SchemaField> = null;
    public editingIndex: MaybeNull<number> = null;
    public addingField: boolean = false;

    private modalService = inject(ModalService);

    public get currentData(): DataSchemaField[] {
        return this.dataRowsSubject.value;
    }

    public setDataRows(rows: DataSchemaField[]): void {
        this.dataRowsSubject.next(rows);
    }

    public editRow(element: DataSchemaField, index: number): void {
        this.editingRow = JSON.parse(JSON.stringify(element)) as SchemaField;
        this.editingIndex = index;
    }

    public deleteRow(rowIndex: number): void {
        const updatedData = this.currentData.filter((_, i) => i !== rowIndex);
        this.setDataRows(updatedData);
    }

    public saveEditing(indexRow: number): void {
        if (!this.editingRow) {
            this.resetEditing();
            return;
        }

        const otherColumnNames = this.currentData
            .filter((_, index) => index !== indexRow)
            .map((item: DataSchemaField) => item.name);
        if (otherColumnNames.includes(this.editingRow.name) && this.addingField) {
            promiseWithCatch(
                this.modalService.warning({
                    message: `Column name "${this.editingRow.name}" already exists`,
                    yesButtonText: "Ok",
                }),
            );
            return;
        }

        const updatedData = [...this.currentData];
        updatedData[indexRow] = this.editingRow;
        this.setDataRows(updatedData);
        this.resetEditing();
    }

    public cancelEditing(): void {
        if (this.addingField) {
            const updatedData = this.currentData.filter((_, i) => i !== this.editingIndex);
            this.setDataRows(updatedData);
        }
        this.resetEditing();
    }

    public startAddField(): void {
        this.addingField = true;
        const newField: DataSchemaField = { name: "newField", type: { kind: OdfTypes.String } };

        this.setDataRows([...this.currentData, newField]);
        this.editingRow = { name: "newField", type: { kind: OdfTypes.String } };
        this.editingIndex = this.currentData.length - 1;
    }

    public typeChangeHandle(event: DataSchemaTypeField): void {
        if (this.editingRow) {
            this.editingRow.type = event;
        }
    }

    public typeStructChange(event: { fields: DataSchemaField[]; index: number }): void {
        const updatedData = [...this.currentData];
        (updatedData[event.index].type as DataSchemaStructField).fields = event.fields;
        this.setDataRows(updatedData);
    }

    public resetEditing(): void {
        this.editingRow = null;
        this.editingIndex = null;
        this.addingField = false;
    }
}

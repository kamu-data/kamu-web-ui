/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "src/app/interface/app.types";
import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { BaseField } from "../base-field";
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { Observable, OperatorFunction, Subject, merge } from "rxjs";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { RxwebValidators, RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import AppValues from "src/app/common/values/app.values";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";

export interface SchemaType {
    name: string;
    type: string;
}

@Component({
    selector: "app-schema-field",
    templateUrl: "./schema-field.component.html",
    styleUrls: ["./schema-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatTableModule,
        NgbTypeahead,
        MatIconModule,
        RxReactiveFormsModule,

        //-----//
        TooltipIconComponent,
    ],
})
export class SchemaFieldComponent extends BaseField implements AfterViewInit {
    @ViewChild(MatTable) private table: MatTable<unknown>;
    @ViewChildren("ngbTypeahead") private ngbType: QueryList<NgbTypeahead>;
    public focus$ = new Subject<SchemaType>();
    public click$ = new Subject<SchemaType>();
    private focusObservableList = Array<Subject<SchemaType>>();
    private defaultType = "";

    public readonly DISPLAYED_COLUMNS: string[] = ["name", "type", "actions"];
    public readonly AVAILABLE_TYPES = [
        "STRING",
        "BIGINT",
        "TIMESTAMP(p)",
        "BOOLEAN",
        "INT",
        "DECIMAL(p,s)",
        "FLOAT",
        "DOUBLE",
        "UUID",
        "DATE",
        "TIME",
    ];
    public readonly VALIDATION_MESSAGES: Record<string, string> = {
        unique: "Name is not unique",
        required: "Name is required",
        pattern: "Incorrect character",
    };

    public ngAfterViewInit(): void {
        let focusItem$ = new Subject<SchemaType>();
        this.focus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((item) => {
            const tableIndex = this.items.controls.findIndex(
                (element: AbstractControl) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    element.value.name === item.name,
            );
            this.focusObservableList.some((focus, index) => {
                if (index === tableIndex) {
                    focusItem$ = focus;
                    return true;
                } else {
                    return false;
                }
            });
            focusItem$.next(item);
        });
    }

    public search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        // input focus stream for each control
        const inputFocus$ = new Subject<SchemaType>();
        this.focusObservableList.push(inputFocus$);
        const focusSteam$ = inputFocus$.pipe(map(() => ""));
        return merge(debouncedText$, focusSteam$).pipe(
            map((term) =>
                term === ""
                    ? this.AVAILABLE_TYPES
                    : this.AVAILABLE_TYPES.filter((v) => v.toLowerCase().includes(term.toLowerCase())),
            ),
        );
    };

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public nameControlByIndex(index: number): MaybeNull<AbstractControl> {
        return this.items.controls[index].get("name");
    }

    public nameControlError(index: number): string {
        let errorMessage = "";
        if (this.nameControlByIndex(index)?.hasError("unique")) {
            errorMessage = this.VALIDATION_MESSAGES.unique;
        } else if (this.nameControlByIndex(index)?.hasError("pattern")) {
            errorMessage = this.VALIDATION_MESSAGES.pattern;
        } else if (
            this.nameControlByIndex(index)?.hasError("required") &&
            (this.nameControlByIndex(index)?.touched || this.nameControlByIndex(index)?.dirty)
        ) {
            errorMessage = this.VALIDATION_MESSAGES.required;
        }
        return errorMessage;
    }

    public addRow(): void {
        this.items.push(
            new FormGroup({
                name: new FormControl("", [
                    RxwebValidators.unique(),
                    RxwebValidators.required(),
                    Validators.pattern(AppValues.SCHEMA_NAME_PATTERN),
                ]),
                type: new FormControl(this.defaultType, [RxwebValidators.required()]),
            }),
        );
        this.table.renderRows();
    }

    public deleteRow(index: number): void {
        this.items.removeAt(index);
        this.focusObservableList.splice(index, 1);
        this.table.renderRows();
    }

    public swap(index: number, direction: number): void {
        const condition = direction > 0 ? index === this.items.length - 1 : index === 0;
        if (condition) {
            return;
        }
        const current = this.items.at(index);
        this.items.removeAt(index);
        this.items.insert(index + direction, current);
        this.table.renderRows();
    }
}

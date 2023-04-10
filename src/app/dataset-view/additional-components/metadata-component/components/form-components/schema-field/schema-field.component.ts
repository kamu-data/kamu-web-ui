/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    QueryList,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { BaseField } from "../base-field";
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { MatTable } from "@angular/material/table";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Observable, OperatorFunction, Subject, merge } from "rxjs";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
} from "rxjs/operators";
import { log } from "console";

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
export class SchemaFieldComponent extends BaseField implements AfterViewInit {
    private defaultType = "";
    @ViewChild(MatTable) table: MatTable<unknown>;
    @ViewChildren("ngbTypeahed") ngbType: QueryList<NgbTypeahead>;
    public focus$ = new Subject<SchemaType>();
    public click$ = new Subject<SchemaType>();
    private focusObservableList = Array<Subject<SchemaType>>();
    private clickObservableList = Array<Subject<SchemaType>>();
    private ngbTypeHeader: NgbTypeahead;

    public displayedColumns: string[] = ["name", "type", "actions"];
    public availableTypes = [
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

    ngAfterViewInit(): void {
        let focusItem$ = new Subject<SchemaType>();
        this.trackSubscription(
            this.focus$.subscribe((item) => {
                const tableIndex = this.items.controls.findIndex(
                    (element: AbstractControl) =>
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
            }),
        );
    }

    public search: OperatorFunction<string, readonly string[]> = (
        text$: Observable<string>,
    ) => {
        const debouncedText$ = text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
        );
        const inputClick$ = new Subject<SchemaType>();
        this.clickObservableList.push(inputClick$);
        const clicksWithClosedPopup$ = inputClick$.pipe(
            filter((item) => {
                const tableIndex = this.items.controls.findIndex(
                    (element: AbstractControl) =>
                        element.value.name === item.name,
                );
                this.ngbType.some((value, index) => {
                    if (tableIndex === index) {
                        this.ngbTypeHeader = value;
                        return true;
                    }
                    return false;
                });
                return this.ngbTypeHeader && !this.ngbTypeHeader.isPopupOpen();
            }),
            map(() => ""),
        );
        // input focus stream for each control
        const inputFocus$ = new Subject<SchemaType>();
        this.focusObservableList.push(inputFocus$);
        const focusSteam$ = inputFocus$.pipe(map(() => ""));
        return merge(debouncedText$, focusSteam$, clicksWithClosedPopup$).pipe(
            map((term) =>
                term === ""
                    ? this.availableTypes
                    : this.availableTypes.filter((v) =>
                          v.toLowerCase().includes(term.toLowerCase()),
                      ),
            ),
        );
    };

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public addRow(): void {
        this.items.push(
            new FormGroup({
                name: new FormControl("", [Validators.required]),
                type: new FormControl(this.defaultType, [Validators.required]),
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

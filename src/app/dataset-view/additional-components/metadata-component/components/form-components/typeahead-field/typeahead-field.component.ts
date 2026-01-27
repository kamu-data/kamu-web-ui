/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, ViewChild } from "@angular/core";
import { BaseField } from "../base-field";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, map, filter } from "rxjs/operators";
import { NgIf } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
@Component({
    selector: "app-typeahead-field",
    templateUrl: "./typeahead-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        //-----//
        NgbTypeahead,
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        FormValidationErrorsDirective,
    ]
})
export class TypeaheadFieldComponent extends BaseField {
    @Input({ required: true }) public data: string[];
    @Input() public requiredField = false;
    @Input() public placeholder?: string;
    @Input() public maxLength?: number;
    @ViewChild("instance", { static: true }) public instance: NgbTypeahead;
    public focus$ = new Subject<string>();
    public click$ = new Subject<string>();

    public search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focus$;
        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map((term) =>
                term === "" ? this.data : this.data.filter((v) => v.toLowerCase().includes(term.toLowerCase())),
            ),
        );
    };
}

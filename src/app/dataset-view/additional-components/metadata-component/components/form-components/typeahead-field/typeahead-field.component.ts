import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { BaseField } from "../base-field";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject, merge } from "rxjs";
import {
    debounceTime,
    distinctUntilChanged,
    map,
    filter,
} from "rxjs/operators";
@Component({
    selector: "app-typeahead-field",
    templateUrl: "./typeahead-field.component.html",
    styleUrls: ["./typeahead-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TypeaheadFieldComponent extends BaseField {
    @Input() public data: string[];
    @Input() public requiredField?: boolean;
    @Input() public placeholder?: string;
    @ViewChild("instance", { static: true }) public instance: NgbTypeahead;
    public focus$ = new Subject<string>();
    public click$ = new Subject<string>();

    public search: OperatorFunction<string, readonly string[]> = (
        text$: Observable<string>,
    ) => {
        const debouncedText$ = text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
        );
        const clicksWithClosedPopup$ = this.click$.pipe(
            filter(() => !this.instance.isPopupOpen()),
        );
        const inputFocus$ = this.focus$;
        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map((term) =>
                term === ""
                    ? this.data
                    : this.data.filter((v) =>
                          v.toLowerCase().includes(term.toLowerCase()),
                      ),
            ),
        );
    };
}

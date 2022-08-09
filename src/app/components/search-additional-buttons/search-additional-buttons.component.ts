import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {
    SearchAdditionalButtonInterface,
    SearchAdditionalHeaderButtonInterface,
} from "./search-additional-buttons.interface";

@Component({
    selector: "app-search-additional-buttons",
    templateUrl: "./search-additional-buttons.component.html",
    styleUrls: ["./search-additional-buttons.component.sass"],
})
export class SearchAdditionalButtonsComponent {
    @Input()
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Input() public isMinimizeSearchAdditionalButtons: boolean;
    @Output() public searchAdditionalButtonsMethod: EventEmitter<string> =
        new EventEmitter();

    public onClick(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}

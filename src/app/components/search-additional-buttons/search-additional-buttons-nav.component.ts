import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    SearchAdditionalButtonInterface,
    SearchAdditionalHeaderButtonInterface,
} from "./search-additional-buttons.interface";

@Component({
    selector: "app-search-additional-buttons-nav",
    templateUrl: "./search-additional-buttons-nav.component.html",
    styleUrls: ["./search-additional-buttons.component.sass"],
})
export class SearchAdditionalButtonsNavComponent {
    @Input()
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
}

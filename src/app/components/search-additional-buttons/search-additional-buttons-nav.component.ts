import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SearchAdditionalHeaderButtonInterface } from "./search-additional-buttons.interface";

@Component({
    selector: "app-search-additional-buttons-nav",
    templateUrl: "./search-additional-buttons-nav.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAdditionalButtonsNavComponent {
    @Input()
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<string>();

    public onClickButton(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}

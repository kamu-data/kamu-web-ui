import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";

@Component({
    selector: "app-search-sidenav",
    templateUrl: "./search-sidenav.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSidenavComponent {
    @Input() public searchValue: string;
    @Input() public isMobileView: boolean;
    @Output() public onInputSearch = new EventEmitter<string>();

    public onSearch(value: string): void {
        this.onInputSearch.emit(value);
    }
}

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { SearchAdditionalHeaderButtonInterface } from "./search-additional-buttons.interface";
import { isMobileView } from "src/app/common/helpers/app.helpers";

@Component({
    selector: "app-search-additional-buttons",
    templateUrl: "./search-additional-buttons.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAdditionalButtonsComponent implements OnInit {
    @Input({ required: true })
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<string>();
    public shouldMinimizeSearchAdditionalButtons = false;
    @ViewChild("menuTrigger") public trigger: ElementRef;

    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.shouldMinimizeSearchAdditionalButtons = isMobileView();
    }

    public ngOnInit(): void {
        this.checkWindowSize();
    }

    public onClick(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}

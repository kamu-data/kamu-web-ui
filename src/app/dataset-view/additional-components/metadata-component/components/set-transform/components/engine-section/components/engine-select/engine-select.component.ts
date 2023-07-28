import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from "@angular/core";
import { EngineDesc } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-engine-select",
    templateUrl: "./engine-select.component.html",
    styleUrls: ["./engine-select.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineSelectComponent implements OnInit {
    @ViewChild("input", { static: true }) input: ElementRef;
    @ViewChild("dropdown", { static: true })
    dropdown: ElementRef<HTMLDivElement>;
    @ViewChild("selectedImage", { static: true })
    selectedImage: ElementRef<HTMLImageElement>;
    public showDropdown = false;
    @Input() data: EngineDesc[];
    @Input() engine: string;
    @Output() selectedEngineEmitter = new EventEmitter<string>();

    constructor(private render: Renderer2) {}

    @HostListener("document:click", ["$event"])
    clickout(event: Event) {
        if (!this.dropdown.nativeElement.contains(event.target as Element)) {
            this.showDropdown = false;
        }
    }

    ngOnInit(): void {
        const defaultEngine = this.data.find(
            (item: EngineDesc) => item.name === this.engine,
        );
        if (defaultEngine) {
            this.clickShowDropdown(defaultEngine);
        }
    }

    public getLogo(name: string): string {
        return (
            DataHelpers.descriptionForEngine(name.toLowerCase()).url_logo ?? ""
        );
    }

    public clickShowDropdown(item: EngineDesc): void {
        this.render.setAttribute(
            this.selectedImage.nativeElement,
            "src",
            this.getLogo(item.name.toLowerCase()),
        );
        this.selectedEngineEmitter.emit(item.name.toUpperCase());
    }

    public clickInput(): void {
        this.showDropdown = !this.showDropdown;
    }
}

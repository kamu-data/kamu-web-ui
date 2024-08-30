import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from "@angular/core";
import { EngineDesc } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";
import { EventPropertyLogo } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

@Component({
    selector: "app-engine-select",
    templateUrl: "./engine-select.component.html",
    styleUrls: ["./engine-select.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineSelectComponent implements OnInit {
    @ViewChild("input", { static: true }) input: ElementRef;
    @ViewChild("dropdown", { static: true })
    dropdown: ElementRef<HTMLDivElement>;
    @ViewChild("selectedImage", { static: true })
    selectedImage: ElementRef<HTMLImageElement>;
    public showDropdown = false;
    @Input({ required: true }) data: EngineDesc[];
    @Input({ required: true }) engine: string;
    @Output() selectedEngineEmitter = new EventEmitter<string>();

    private render = inject(Renderer2);

    @HostListener("document:click", ["$event"])
    clickOut(event: Event) {
        if (!this.dropdown.nativeElement.contains(event.target as Element)) {
            this.showDropdown = false;
        }
    }

    ngOnInit(): void {
        const defaultEngine = this.data.find((item: EngineDesc) => item.name === this.engine);
        if (defaultEngine) {
            this.clickShowDropdown(defaultEngine);
        }
    }

    public get value(): string {
        const engineDesc = DataHelpers.descriptionForEngine(this.engine);
        return engineDesc.label ?? engineDesc.name;
    }

    public getLogo(name: string): EventPropertyLogo {
        return DataHelpers.descriptionForEngine(name);
    }

    public clickShowDropdown(item: EngineDesc): void {
        const description = item.name.toLowerCase();
        this.render.setAttribute(this.selectedImage.nativeElement, "src", this.getLogo(description).url_logo ?? "");
        this.selectedEngineEmitter.emit(description);
    }

    public clickInput(): void {
        this.showDropdown = !this.showDropdown;
    }
}

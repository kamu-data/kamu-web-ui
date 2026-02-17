/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
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
import { DataHelpers } from "@common/helpers/data.helpers";
import { EventPropertyLogo } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

@Component({
    selector: "app-engine-select",
    templateUrl: "./engine-select.component.html",
    styleUrls: ["./engine-select.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, NgFor],
})
export class EngineSelectComponent implements OnInit {
    @ViewChild("input", { static: true }) public input: ElementRef;
    @ViewChild("dropdown", { static: true })
    private dropdown: ElementRef<HTMLDivElement>;
    @ViewChild("selectedImage", { static: true })
    private selectedImage: ElementRef<HTMLImageElement>;
    public showDropdown = false;
    @Input({ required: true }) public data: EngineDesc[];
    @Input({ required: true }) public engine: string;
    @Input() public disabledOptionsMode: boolean = false;
    @Output() public selectedEngineEmitter = new EventEmitter<string>();

    private render = inject(Renderer2);

    @HostListener("document:click", ["$event"])
    public clickOut(event: Event) {
        if (!this.dropdown.nativeElement.contains(event.target as Element)) {
            this.showDropdown = false;
        }
    }

    public ngOnInit(): void {
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

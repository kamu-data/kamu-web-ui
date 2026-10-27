/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    Output,
    Renderer2,
    ViewChild,
} from "@angular/core";

import { DataHelpers } from "@common/helpers/data.helpers";
import { EngineDescDataFragment } from "@api/kamu.graphql.interface";

import { EventPropertyLogo } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

@Component({
    selector: "app-engine-select",
    templateUrl: "./engine-select.component.html",
    styleUrls: ["./engine-select.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineSelectComponent {
    @ViewChild("input", { static: true }) public input: ElementRef;
    @ViewChild("dropdown", { static: true })
    private dropdown: ElementRef<HTMLDivElement>;
    @ViewChild("selectedImage", { static: true })
    private selectedImage: ElementRef<HTMLImageElement>;
    public showDropdown = false;
    @Input({ required: true }) public data: EngineDescDataFragment[];
    @Input({ required: true }) public engine: string;
    @Input() public disabledOptionsMode: boolean = false;
    @Output() public selectedEngineEmitter = new EventEmitter<string>();

    private render = inject(Renderer2);

    @HostListener("document:click", ["$event"])
    public clickOut(event: Event) {
        if (!(event.target instanceof Node) || !this.dropdown.nativeElement.contains(event.target)) {
            this.showDropdown = false;
        }
    }

    public get value(): string {
        const engineDesc = DataHelpers.descriptionForEngine(this.engine);
        return engineDesc.label ?? engineDesc.name;
    }

    public getLogo(name: string): EventPropertyLogo {
        return DataHelpers.descriptionForEngine(name);
    }

    public clickShowDropdown(item: EngineDescDataFragment): void {
        const description = item.name.toLowerCase();
        this.render.setAttribute(this.selectedImage.nativeElement, "src", this.getLogo(description).url_logo ?? "");
        this.selectedEngineEmitter.emit(description);
    }

    public clickInput(): void {
        this.showDropdown = !this.showDropdown;
    }
}

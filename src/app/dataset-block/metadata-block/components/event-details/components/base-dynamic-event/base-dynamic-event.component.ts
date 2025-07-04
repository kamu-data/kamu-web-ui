/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    Component,
    ChangeDetectionStrategy,
    Input,
    ViewChildren,
    ViewContainerRef,
    QueryList,
    ChangeDetectorRef,
    ComponentRef,
    AfterViewChecked,
    inject,
} from "@angular/core";
import { EventRow, EventSection } from "../../dynamic-events/dynamic-events.model";
import { BasePropertyComponent } from "../common/base-property/base-property.component";
import { BaseComponent } from "src/app/common/components/base.component";
import { MatIconModule } from "@angular/material/icon";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { NgFor, NgIf } from "@angular/common";

@Component({
    selector: "app-dynamic-base-event",
    templateUrl: "./base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgFor,
        NgIf,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
    ],
})
export class BaseDynamicEventComponent<TEvent extends object> extends BaseComponent implements AfterViewChecked {
    @Input({ required: true }) public event: TEvent;
    @ViewChildren("container", { read: ViewContainerRef })
    private container: QueryList<ViewContainerRef>;
    protected eventSections: EventSection[];

    protected cdr = inject(ChangeDetectorRef);

    public ngAfterViewChecked(): void {
        let componentRef: ComponentRef<BasePropertyComponent>;
        const rows: EventRow[] = [];
        this.eventSections
            .map((item) => item.rows)
            .forEach((item: EventRow[]) => {
                rows.push(...item);
            });
        this.container.forEach((vcr: ViewContainerRef, index: number) => {
            vcr.clear();
            componentRef = vcr.createComponent<BasePropertyComponent>(rows[index].descriptor.presentationComponent);
            componentRef.setInput("data", rows[index].value);
            componentRef.instance.dataTestId = rows[index].descriptor.dataTestId;
            componentRef.changeDetectorRef.detectChanges();
        });
    }
}

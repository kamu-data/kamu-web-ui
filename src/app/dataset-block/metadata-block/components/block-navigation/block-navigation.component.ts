/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { debounceTime, filter, map, merge, Observable } from "rxjs";

import { NgSelectModule } from "@ng-select/ng-select";

import { PagePastEndComponent } from "@common/components/page-past-end/page-past-end.component";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { isEqual } from "@common/helpers/app.helpers";
import { MetadataBlockLinkPipe } from "@common/pipes/metadata-block-link.pipe";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { ValidationPatterns } from "@common/validation/patterns";
import { formatValidator } from "@common/validation/text.validators";
import AppValues from "@common/values/app.values";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { BlockListFilter } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

@Component({
    selector: "app-block-navigation",
    templateUrl: "./block-navigation.component.html",
    styleUrls: ["./block-navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        RouterLink,
        //-----//
        MatIconModule,
        NgSelectModule,
        //-----//
        FormValidationErrorsDirective,
        PagePastEndComponent,
        PaginationComponent,
        MetadataBlockLinkPipe,
    ],
})
export class BlockNavigationComponent {
    @Input({ required: true }) public datasetHistory: MaybeNull<DatasetHistoryUpdate>;
    @Input({ required: true }) public currentBlockHash: string;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public set filter(value: BlockListFilter) {
        this.activeFilter = value;
        // The page echoes each emitted filter back through the URL, which must not undo what the user typed since
        const echoed = this.pendingFilters.findIndex((pending) => isEqual(pending, value));
        if (echoed >= 0) {
            this.pendingFilters.splice(0, echoed + 1);
            return;
        }
        this.pendingFilters = [];
        if (value.hashPrefix) {
            this.filterForm.controls.hashPrefix.markAsTouched();
        }
        // With events, which the field's error message renders on; the user edits below skip them
        this.applyingFilter = true;
        try {
            this.filterForm.setValue(value);
        } finally {
            this.applyingFilter = false;
        }
    }
    @Output() public onPageChangeEmit = new EventEmitter<number>();
    @Output() public filterChange = new EventEmitter<BlockListFilter>();

    public readonly eventTypeOptions = Object.values(SupportedEvents);
    public readonly filterForm = new FormGroup({
        eventTypes: new FormControl<SupportedEvents[]>([], { nonNullable: true }),
        hashPrefix: new FormControl("", {
            nonNullable: true,
            validators: [formatValidator(ValidationPatterns.BLOCK_HASH_PREFIX)],
        }),
    });

    /** The filter the list shows, as the page's URL holds it. */
    public activeFilter: BlockListFilter = { eventTypes: [], hashPrefix: "" };
    /** The filters emitted that the URL has not brought back yet, oldest first. */
    private pendingFilters: BlockListFilter[] = [];
    private applyingFilter = false;

    public constructor() {
        const { eventTypes, hashPrefix } = this.filterForm.controls;
        const userEdits = <T>(changes: Observable<T>) => changes.pipe(filter(() => !this.applyingFilter));
        merge(
            userEdits(eventTypes.valueChanges),
            userEdits(hashPrefix.valueChanges).pipe(debounceTime(AppValues.SHORT_DELAY_MS)),
        )
            .pipe(
                // The backend rejects a malformed prefix, so the list keeps the last valid filter
                filter(() => hashPrefix.valid),
                map(() => this.currentFilter()),
                filter(
                    (value) =>
                        !isEqual(
                            value,
                            BlockNavigationComponent.trimmed(this.pendingFilters.at(-1) ?? this.activeFilter),
                        ),
                ),
                takeUntilDestroyed(),
            )
            .subscribe((value) => {
                this.pendingFilters.push(value);
                this.filterChange.emit(value);
            });
    }

    /** How many leading characters of the hash match the searched prefix: none when it doesn't start with it. */
    public matchedPrefixLength(hash: string): number {
        const prefix = this.filterForm.controls.hashPrefix.value.trim().toLowerCase();
        return prefix !== "" && hash.toLowerCase().startsWith(prefix) ? prefix.length : 0;
    }

    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }

    public refreshSearch(): void {
        this.filterForm.controls.hashPrefix.setValue("");
    }

    private currentFilter(): BlockListFilter {
        return BlockNavigationComponent.trimmed(this.filterForm.getRawValue());
    }

    private static trimmed(filter: BlockListFilter): BlockListFilter {
        return { eventTypes: filter.eventTypes, hashPrefix: filter.hashPrefix.trim() };
    }
}

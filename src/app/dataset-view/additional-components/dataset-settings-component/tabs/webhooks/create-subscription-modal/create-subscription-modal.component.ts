/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import AppValues from "src/app/common/values/app.values";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { WebhooksService } from "src/app/services/webhooks.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SubscribedEventType } from "./create-subscription-modal.model";

@Component({
    selector: "app-create-subscription-modal",
    templateUrl: "./create-subscription-modal.component.html",
    styleUrls: ["./create-subscription-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSubscriptionModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public DROPDOWN_LIST: SubscribedEventType[] = [];

    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);
    private webhooksService = inject(WebhooksService);

    public ngOnInit(): void {
        this.webhooksService
            .eventTypes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((eventTypes: string[]) => {
                this.DROPDOWN_LIST = eventTypes.map((eventType, index) => {
                    return { id: index, name: this.eventTypesMapper(eventType), value: eventType };
                });
            });
    }

    public createSubscriptionForm = this.fb.group({
        targetUrl: this.fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
        eventTypes: [[], Validators.required],
        label: this.fb.control("", [Validators.required]),
    });

    private eventTypesMapper(name: string): string {
        switch (name) {
            case "DATASET.REF.UPDATED":
                return "Dataset Updated";
            default:
                return "Unknown event type";
        }
    }
}

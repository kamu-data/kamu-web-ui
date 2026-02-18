/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NGX_MONACO_EDITOR_CONFIG } from "ngx-monaco-editor-v2";

import { BaseComponent } from "@common/components/base.component";
import { MaybeNull } from "@interface/app.types";

import { EngineSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.component";
import { QueriesSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/queries-section/queries-section.component";
import {
    AddPollingSourceEditFormType,
    PreprocessStepValue,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";

@Component({
    selector: "app-preprocess-step",
    templateUrl: "./preprocess-step.component.html",
    styleUrls: ["./preprocess-step.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        //-----//
        EngineSectionComponent,
        QueriesSectionComponent,
    ],
    providers: [
        {
            provide: NGX_MONACO_EDITOR_CONFIG,
            useValue: {},
        },
    ],
})
export class PreprocessStepComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public showPreprocessStep: boolean;
    @Input({ required: true }) public eventYamlByHash: MaybeNull<string> = null;
    @Input({ required: true }) public preprocessValue: PreprocessStepValue;
    @Output() public showPreprocessStepEmitter = new EventEmitter<boolean>();
    public setPollingSourceEvent: MaybeNull<AddPollingSourceEditFormType> = null;

    private editService = inject(EditPollingSourceService);

    public ngOnInit(): void {
        if (this.eventYamlByHash) {
            this.setPollingSourceEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
            if (this.setPollingSourceEvent.preprocess) {
                this.showPreprocessStepEmitter.emit(true);
                this.initExistingQueries();
            } else {
                this.initDefaultQueriesSection();
            }
        } else {
            this.initDefaultQueriesSection();
        }
    }

    public onSelectEngine(engine: string): void {
        this.preprocessValue.engine = engine;
    }

    public onCheckedPreprocessStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.showPreprocessStepEmitter.emit(input.checked);
    }

    private initDefaultQueriesSection(query = ""): void {
        if (!this.preprocessValue.queries.length) {
            this.preprocessValue.queries.push({
                query,
            });
        }
    }

    private initExistingQueries(): void {
        if (this.preprocessValue.queries.length === 0) {
            if (this.setPollingSourceEvent?.preprocess?.query) {
                this.initDefaultQueriesSection(this.setPollingSourceEvent.preprocess.query);
            } else if (this.setPollingSourceEvent?.preprocess?.queries.length) {
                this.preprocessValue.queries = this.setPollingSourceEvent.preprocess.queries;
            }
        }
    }
}

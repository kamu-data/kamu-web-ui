/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "src/app/common/values/app.values";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EngineDesc, EnginesQuery, TransformSql } from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeNullOrUndefined } from "src/app/interface/app.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { FormsModule } from "@angular/forms";
import { EngineSelectComponent } from "./components/engine-select/engine-select.component";
import { MatDividerModule } from "@angular/material/divider";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-engine-section",
    templateUrl: "./engine-section.component.html",
    styleUrls: ["./engine-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgIf,

        //-----//
        MatDividerModule,

        //-----//
        EngineSelectComponent,
    ],
})
export class EngineSectionComponent extends BaseComponent implements OnInit {
    @Input() public knownEngines: MaybeNull<EngineDesc[]>;
    @Input({ required: true }) public set currentSetTransformEvent(value: MaybeNullOrUndefined<TransformSql>) {
        if (value) {
            this.onSelectType(value.engine);
        }
    }
    @Input() public selectedEngine: string;
    @Output() public onEmitSelectedEngine: EventEmitter<string> = new EventEmitter<string>();
    public selectedImage: string;

    private cdr = inject(ChangeDetectorRef);
    private engineService = inject(EngineService);

    public ngOnInit(): void {
        this.initEngineSection();
    }

    public onSelectType(item: string): void {
        this.selectedEngine = item;
        if (this.knownEngines) {
            const result = this.knownEngines.find(
                (item) => item.name.toUpperCase() === this.selectedEngine.toUpperCase(),
            );

            if (result) {
                this.selectedImage = result.latestImage;
                this.onEmitSelectedEngine.emit(this.selectedEngine.toUpperCase());
            }
        }
    }

    private initEngineSection(): void {
        this.engineService
            .engines()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result: EnginesQuery) => {
                this.knownEngines = result.data.knownEngines;
                if (!this.selectedEngine) {
                    this.selectedEngine = AppValues.DEFAULT_ENGINE_NAME;
                    this.selectedImage = AppValues.DEFAULT_ENGINE_IMAGE;
                    this.initCurrentEngine();
                } else {
                    this.onSelectType(this.selectedEngine);
                }
                this.onEmitSelectedEngine.emit(this.selectedEngine);
                this.cdr.detectChanges();
            });
    }

    private initCurrentEngine(): void {
        if (this.currentSetTransformEvent?.engine) {
            this.selectedEngine = this.currentSetTransformEvent.engine;
            this.onSelectType(this.selectedEngine.toUpperCase().toLowerCase());
        }
    }
}

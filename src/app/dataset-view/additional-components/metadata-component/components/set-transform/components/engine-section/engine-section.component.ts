/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { BaseComponent } from "@common/components/base.component";
import AppValues from "@common/values/app.values";
import { EngineDescDataFragment, EnginesQuery } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { EngineSelectComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";

@Component({
    selector: "app-engine-section",
    templateUrl: "./engine-section.component.html",
    styleUrls: ["./engine-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        //-----//
        MatDividerModule,
        //-----//
        EngineSelectComponent,
    ],
})
export class EngineSectionComponent extends BaseComponent implements OnInit {
    @Input() public knownEngines: MaybeNull<EngineDescDataFragment[]>;
    @Input() public initialEngine: MaybeUndefined<string>;
    @Output() public onEmitSelectedEngine: EventEmitter<string> = new EventEmitter<string>();
    public selectedEngine: string = AppValues.DEFAULT_ENGINE_NAME;
    public selectedImage: string;
    /** The engine the transform names or the user picked, kept when the engine list is emitted again. */
    private pickedEngine: MaybeUndefined<string>;

    private cdr = inject(ChangeDetectorRef);
    private engineService = inject(EngineService);

    public ngOnInit(): void {
        this.pickedEngine = this.initialEngine;
        this.initEngineSection();
    }

    public onSelectType(engine: string): void {
        this.pickedEngine = engine;
        this.selectedEngine = engine;
        if (this.knownEngines) {
            const result = this.knownEngines.find((item) => item.name.toUpperCase() === engine.toUpperCase());

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
                if (!this.pickedEngine) {
                    this.selectedEngine = AppValues.DEFAULT_ENGINE_NAME;
                    this.selectedImage = AppValues.DEFAULT_ENGINE_IMAGE;
                } else {
                    this.onSelectType(this.pickedEngine);
                }
                this.onEmitSelectedEngine.emit(this.selectedEngine);
                this.cdr.detectChanges();
            });
    }
}

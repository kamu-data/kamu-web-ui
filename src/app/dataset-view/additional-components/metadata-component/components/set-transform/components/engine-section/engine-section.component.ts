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
import { MaybeNull, MaybeNullOrUndefined } from "src/app/common/types/app.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";

@Component({
    selector: "app-engine-section",
    templateUrl: "./engine-section.component.html",
    styleUrls: ["./engine-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineSectionComponent extends BaseComponent implements OnInit {
    @Input() public knownEngines: MaybeNull<EngineDesc[]>;
    @Input({ required: true }) public currentSetTransformEvent: MaybeNullOrUndefined<TransformSql>;
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
                    this.selectedEngine = this.knownEngines[0].name;
                    this.selectedImage = this.knownEngines[0].latestImage;
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

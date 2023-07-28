import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    EngineDesc,
    EnginesQuery,
    Maybe,
    TransformSql,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { EngineService } from "src/app/services/engine.service";

@Component({
    selector: "app-engine-section",
    templateUrl: "./engine-section.component.html",
    styleUrls: ["./engine-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineSectionComponent extends BaseComponent implements OnInit {
    @Input() public knownEngines: MaybeNull<EngineDesc[]>;
    @Input() public currentSetTransformEvent: Maybe<TransformSql> | undefined;
    @Input() public selectedEngine: string;
    @Output() public onEmitSelectedEngine: EventEmitter<string> =
        new EventEmitter<string>();
    public selectedImage: string;

    constructor(
        private cdr: ChangeDetectorRef,
        private engineService: EngineService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.initEngineSection();
    }

    public onSelectType(item: string): void {
        this.selectedEngine = item;
        if (this.knownEngines) {
            const result = this.knownEngines.find(
                (item) =>
                    item.name.toUpperCase() ===
                    this.selectedEngine.toUpperCase(),
            );

            if (result) {
                this.selectedImage = result.latestImage;
                this.onEmitSelectedEngine.emit(
                    this.selectedEngine.toUpperCase(),
                );
            }
        }
    }

    private initEngineSection(): void {
        this.trackSubscription(
            this.engineService.engines().subscribe((result: EnginesQuery) => {
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
            }),
        );
    }

    private initCurrentEngine(): void {
        if (this.currentSetTransformEvent?.engine) {
            const currentEngine: string = this.currentSetTransformEvent.engine;
            this.selectedEngine = currentEngine;
            this.onSelectType(this.selectedEngine.toUpperCase().toLowerCase());
        }
    }
}

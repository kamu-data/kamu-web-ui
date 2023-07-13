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
    ControlContainer,
    FormGroup,
    FormGroupDirective,
} from "@angular/forms";
import {
    EngineDesc,
    EnginesQuery,
    Transform,
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
    @Input() public currentSetTransformEvent: Transform | undefined;
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

    public onSelectType(): void {
        if (this.knownEngines) {
            const result = this.knownEngines.find(
                (item) => item.name.toUpperCase() === this.selectedEngine,
            );
            if (result) {
                this.selectedImage = result.latestImage;
                this.onEmitSelectedEngine.emit(this.selectedEngine);
            }
        }
    }

    private initEngineSection(): void {
        this.trackSubscription(
            this.engineService.engines().subscribe((result: EnginesQuery) => {
                this.knownEngines = result.data.knownEngines;
                this.selectedEngine = this.knownEngines[0].name.toUpperCase();
                this.selectedImage = this.knownEngines[0].latestImage;
                this.initCurrentEngine();
                this.onEmitSelectedEngine.emit(this.selectedEngine);
                this.cdr.detectChanges();
            }),
        );
    }

    private initCurrentEngine(): void {
        if (this.currentSetTransformEvent?.engine) {
            const currentEngine: string = this.currentSetTransformEvent.engine;
            this.selectedEngine = currentEngine.toUpperCase();
            this.onSelectType();
        }
    }
}

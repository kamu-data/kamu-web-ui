import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    flush,
    tick,
} from "@angular/core/testing";
import { EngineSectionComponent } from "./engine-section.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { EngineService } from "src/app/services/engine.service";
import { of } from "rxjs";
import { mockEngines } from "../../mock.data";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { mockSetPollingSourceEvent } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { EngineSelectComponent } from "./components/engine-select/engine-select.component";

describe("EngineSectionComponent", () => {
    let component: EngineSectionComponent;
    let fixture: ComponentFixture<EngineSectionComponent>;
    let engineService: EngineService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineSectionComponent, EngineSelectComponent],
            providers: [Apollo],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                FormsModule,
                MatDividerModule,
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSectionComponent);
        component = fixture.componentInstance;
        engineService = TestBed.inject(EngineService);
        spyOn(engineService, "engines").and.returnValue(of(mockEngines));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init default engine and image", fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(component.selectedEngine.toUpperCase()).toBe(
            mockEngines.data.knownEngines[0].name.toUpperCase(),
        );
        expect(component.selectedImage).toBe(
            mockEngines.data.knownEngines[0].latestImage,
        );
        flush();
    }));

    it("should check init engine and image when currentSetTransformEvent is not null", fakeAsync(() => {
        component.currentSetTransformEvent =
            mockSetPollingSourceEvent.preprocess;
        fixture.detectChanges();
        component.ngOnInit();
        tick();
        if (mockSetPollingSourceEvent.preprocess)
            expect(component.selectedEngine).toBe(
                mockSetPollingSourceEvent.preprocess.engine.toUpperCase(),
            );
        flush();
    }));
});

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
import { mockCurrentSetTransform, mockEngines } from "../../mock.data";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

describe("EngineSectionComponent", () => {
    let component: EngineSectionComponent;
    let fixture: ComponentFixture<EngineSectionComponent>;
    let engineService: EngineService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineSectionComponent],
            providers: [Apollo],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                FormsModule,
                MatDividerModule,
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
        expect(component.selectedEngine).toBe(
            mockEngines.data.knownEngines[0].name.toUpperCase(),
        );
        expect(component.selectedImage).toBe(
            mockEngines.data.knownEngines[0].latestImage,
        );
        flush();
    }));

    // it("should check init engine and image when currentSetTransformEvent is not null", fakeAsync(() => {
    //     component.currentSetTransformEvent = mockCurrentSetTransform;
    //     fixture.detectChanges();
    //     component.ngOnInit();
    //     tick();
    //     expect(component.selectedEngine).toBe(
    //         mockCurrentSetTransform.transform.engine.toUpperCase(),
    //     );
    //     flush();
    // }));
});

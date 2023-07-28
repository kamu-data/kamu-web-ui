import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EngineSelectComponent } from "./engine-select.component";
import { mockEngines } from "../../../../mock.data";

describe("EngineSelectComponent", () => {
    let component: EngineSelectComponent;
    let fixture: ComponentFixture<EngineSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSelectComponent);
        component = fixture.componentInstance;
        component.data = mockEngines.data.knownEngines;
        component.engine = "Spark";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

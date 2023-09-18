import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EngineSelectComponent } from "./engine-select.component";
import { mockEngines } from "../../../../mock.data";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { Engine } from "../../engine-section.types";

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
        component.engine = Engine.Spark;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open dropdown", () => {
        expect(component.showDropdown).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "input-dropdown");
        expect(component.showDropdown).toEqual(true);
    });

    it("should check close dropdown when click dropdown outside", () => {
        expect(component.showDropdown).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "input-dropdown");
        expect(component.showDropdown).toEqual(true);
        document.dispatchEvent(new MouseEvent("click"));
        expect(component.showDropdown).toEqual(false);
    });
});

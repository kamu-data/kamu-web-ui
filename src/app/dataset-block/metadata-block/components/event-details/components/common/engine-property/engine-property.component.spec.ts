import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EnginePropertyComponent } from "./engine-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("EnginePropertyComponent", () => {
    let component: EnginePropertyComponent;
    let fixture: ComponentFixture<EnginePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnginePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EnginePropertyComponent);
        component = fixture.componentInstance;
        component.data = "spark";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

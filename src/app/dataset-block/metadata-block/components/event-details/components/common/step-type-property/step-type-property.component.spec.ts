import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StepTypePropertyComponent } from "./step-type-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("StepTypePropertyComponent", () => {
    let component: StepTypePropertyComponent;
    let fixture: ComponentFixture<StepTypePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StepTypePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(StepTypePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

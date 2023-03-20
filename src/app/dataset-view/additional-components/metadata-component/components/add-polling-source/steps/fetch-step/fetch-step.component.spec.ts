import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FetchStepComponent } from "./fetch-step.component";

describe("FetchStepComponent", () => {
    let component: FetchStepComponent;
    let fixture: ComponentFixture<FetchStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FetchStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FetchStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MergeStrategyPropertyComponent } from "./merge-strategy-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("MergeStrategyPropertyComponent", () => {
    let component: MergeStrategyPropertyComponent;
    let fixture: ComponentFixture<MergeStrategyPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MergeStrategyPropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MergeStrategyPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

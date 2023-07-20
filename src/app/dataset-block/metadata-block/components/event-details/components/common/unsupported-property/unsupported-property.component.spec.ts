import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UnsupportedPropertyComponent } from "./unsupported-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("UnsupportedPropertyComponent", () => {
    let component: UnsupportedPropertyComponent;
    let fixture: ComponentFixture<UnsupportedPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UnsupportedPropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(UnsupportedPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

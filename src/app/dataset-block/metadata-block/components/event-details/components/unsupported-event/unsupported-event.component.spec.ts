import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UnsupportedEventComponent } from "./unsupported-event.component";
import { MatIconModule } from "@angular/material/icon";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("UnsupportedEventComponent", () => {
    let component: UnsupportedEventComponent;
    let fixture: ComponentFixture<UnsupportedEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UnsupportedEventComponent],
            imports: [MatIconModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(UnsupportedEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventTimePropertyComponent } from "./event-time-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("EventTimePropertyComponent", () => {
    let component: EventTimePropertyComponent;
    let fixture: ComponentFixture<EventTimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventTimePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EventTimePropertyComponent);
        component = fixture.componentInstance;
        component.data = { __typename: "EventTimeSourceFromMetadata" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

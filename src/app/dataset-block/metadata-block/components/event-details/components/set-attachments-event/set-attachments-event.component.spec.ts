import { mockSetAttachments } from "../../mock.events";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetAttachmentsEventComponent } from "./set-attachments-event.component";

describe("SetAttachmentsEventComponent", () => {
    let component: SetAttachmentsEventComponent;
    let fixture: ComponentFixture<SetAttachmentsEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetAttachmentsEventComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetAttachmentsEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetAttachments;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

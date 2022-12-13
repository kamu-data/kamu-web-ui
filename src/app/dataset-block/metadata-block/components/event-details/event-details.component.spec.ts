import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";

import { EventDetailsComponent } from "./event-details.component";

describe("EventDetailsComponent", () => {
    let component: EventDetailsComponent;
    let fixture: ComponentFixture<EventDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventDetailsComponent],
            providers: [Apollo, DatasetApi],
        }).compileComponents();

        fixture = TestBed.createComponent(EventDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

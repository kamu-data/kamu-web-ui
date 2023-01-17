import { NO_ERRORS_SCHEMA } from "@angular/core";
import { mockSetPollingSourceEvent } from "./../../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { YamlEventViewerComponent } from "./yaml-event-viewer.component";

describe("YamlEventViewerComponent", () => {
    let component: YamlEventViewerComponent;
    let fixture: ComponentFixture<YamlEventViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(YamlEventViewerComponent);
        component = fixture.componentInstance;
        component.event = mockSetPollingSourceEvent;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

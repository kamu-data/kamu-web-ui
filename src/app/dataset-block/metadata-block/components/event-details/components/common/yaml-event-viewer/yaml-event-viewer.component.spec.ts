import { SetTransform } from "./../../../../../../../api/kamu.graphql.interface";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { mockSetTransform } from "./../../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { YamlEventViewerComponent } from "./yaml-event-viewer.component";

describe("YamlEventViewerComponent", () => {
    let component: YamlEventViewerComponent<SetTransform>;
    let fixture: ComponentFixture<YamlEventViewerComponent<SetTransform>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent<
            YamlEventViewerComponent<SetTransform>
        >(YamlEventViewerComponent);
        component = fixture.componentInstance;
        component.event = mockSetTransform as SetTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

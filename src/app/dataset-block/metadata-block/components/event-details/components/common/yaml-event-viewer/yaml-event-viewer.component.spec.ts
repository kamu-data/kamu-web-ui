import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { YamlEventViewerComponent } from "./yaml-event-viewer.component";

describe("YamlEventViewerComponent with SetTransform", () => {
    let component: YamlEventViewerComponent;
    let fixture: ComponentFixture<YamlEventViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent<YamlEventViewerComponent>(YamlEventViewerComponent);
        component = fixture.componentInstance;
        component.data = "test";
        fixture.detectChanges();
    });

    it("should create component with SetTransform", () => {
        expect(component).toBeTruthy();
    });
});

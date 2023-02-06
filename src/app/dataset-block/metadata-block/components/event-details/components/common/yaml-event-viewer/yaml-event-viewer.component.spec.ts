import {
    SetAttachments,
    SetInfo,
    SetLicense,
    SetTransform,
} from "./../../../../../../../api/kamu.graphql.interface";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
    mockSetAttachments,
    mockSetInfo,
    mockSetLicense,
    mockSetTransform,
} from "./../../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { YamlEventViewerComponent } from "./yaml-event-viewer.component";

describe("YamlEventViewerComponent with SetTransform", () => {
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

    it("should create component with SetTransform", () => {
        expect(component).toBeTruthy();
    });
});

describe("YamlEventViewerComponent with SetLicense", () => {
    let component: YamlEventViewerComponent<SetLicense>;
    let fixture: ComponentFixture<YamlEventViewerComponent<SetLicense>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent<YamlEventViewerComponent<SetLicense>>(
            YamlEventViewerComponent,
        );
        component = fixture.componentInstance;
        component.event = mockSetLicense;
        fixture.detectChanges();
    });

    it("should create component with SetLicense", () => {
        expect(component).toBeTruthy();
    });
});

describe("YamlEventViewerComponent with SetInfo", () => {
    let component: YamlEventViewerComponent<SetInfo>;
    let fixture: ComponentFixture<YamlEventViewerComponent<SetInfo>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent<YamlEventViewerComponent<SetInfo>>(
            YamlEventViewerComponent,
        );
        component = fixture.componentInstance;
        component.event = mockSetInfo;
        fixture.detectChanges();
    });

    it("should create component with SetInfo", () => {
        expect(component).toBeTruthy();
    });
});

describe("YamlEventViewerComponent with SetAttachments", () => {
    let component: YamlEventViewerComponent<SetAttachments>;
    let fixture: ComponentFixture<YamlEventViewerComponent<SetAttachments>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent<
            YamlEventViewerComponent<SetAttachments>
        >(YamlEventViewerComponent);
        component = fixture.componentInstance;
        component.event = mockSetAttachments;
        fixture.detectChanges();
    });

    it("should create component with SetAttachments", () => {
        expect(component).toBeTruthy();
    });
});

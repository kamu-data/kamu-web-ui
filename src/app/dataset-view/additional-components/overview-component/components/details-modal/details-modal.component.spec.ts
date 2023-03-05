import { ApolloTestingModule } from "apollo-angular/testing";
import {
    emitClickOnElement,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { FormsModule } from "@angular/forms";
import { mockDatasetBasicsFragment } from "./../../../../../search/mock.data";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { EditDetailsModalComponent } from "./details-modal.component";
import {
    mockMetadataSchemaUpdate,
    mockOverviewDataUpdate,
    mockOverviewWithSetInfo,
} from "../../../data-tabs.mock";
import {
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
} from "src/app/api/kamu.graphql.interface";

describe("EditDetailsModalComponent", () => {
    let component: EditDetailsModalComponent;
    let fixture: ComponentFixture<EditDetailsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditDetailsModalComponent],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                FormsModule,
                MatChipsModule,
            ],
            providers: [Apollo, NgbActiveModal],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(EditDetailsModalComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        component.currentState = {
            schema: mockMetadataSchemaUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview:
                mockOverviewDataUpdate.overview as DatasetOverviewFragment,
            size: mockOverviewDataUpdate.size as DatasetDataSizeFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initialize details", () => {
        component.currentState = {
            schema: mockMetadataSchemaUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewWithSetInfo as DatasetOverviewFragment,
            size: mockOverviewDataUpdate.size as DatasetDataSizeFragment,
        };
        fixture.detectChanges();
        component.ngOnInit();

        expect(component.keywords).toBeDefined();
        expect(component.description).toBeDefined();
    });

    it("should check commit event", () => {
        const commitSetInfoEventSpy = spyOn(
            component,
            "commitSetInfoEvent",
        ).and.callThrough();

        const inputKeyword = findElementByDataTestId(fixture, "input-keyword");
        component.addKeywordFromInput({
            input: inputKeyword,
            value: "keyword1",
            chipInput: {
                clear: () => undefined,
            },
        } as MatChipInputEvent);
        fixture.detectChanges();
        emitClickOnElement(fixture, '[data-test-id="commit-event"]');

        expect(commitSetInfoEventSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add keyword", () => {
        const inputKeyword = findElementByDataTestId(fixture, "input-keyword");
        expect(component.keywords.length).toBe(0);

        component.addKeywordFromInput({
            input: inputKeyword,
            value: "keyword1",
            chipInput: {
                clear: () => undefined,
            },
        } as MatChipInputEvent);
        fixture.detectChanges();

        expect(component.keywords.length).toBe(1);
    });

    it("should check remove keyword", () => {
        const inputKeyword = findElementByDataTestId(fixture, "input-keyword");
        expect(component.keywords.length).toBe(0);

        component.addKeywordFromInput({
            input: inputKeyword,
            value: "keyword1",
            chipInput: {
                clear: () => undefined,
            },
        } as MatChipInputEvent);
        fixture.detectChanges();
        expect(component.keywords.length).toBe(1);

        component.removeKeyword("keyword1");
        fixture.detectChanges();

        expect(component.keywords.length).toBe(0);
    });
});

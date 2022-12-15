import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockAddData } from "../../mock.events";

import { AddDataEventComponent } from "./add-data-event.component";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddDataEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [DisplaySizeModule],
        }).compileComponents();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        component.event = mockAddData;
        component.datasetInfo = mockDatasetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

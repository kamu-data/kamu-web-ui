import { SizePropertyComponent } from "./../common/size-property/size-property.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockAddData } from "../../mock.events";

import { AddDataEventComponent } from "./add-data-event.component";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddDataEventComponent, SizePropertyComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [DisplaySizeModule],
        }).compileComponents();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        component.event = mockAddData;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

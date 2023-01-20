import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetTransform } from "../../mock.events";
import { DatasetKindPropertyComponent } from "../common/dataset-kind-property/dataset-kind-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";

import { SetTransformEventComponent } from "./set-transform-event.component";

describe("SetTransformEventComponent", () => {
    let component: SetTransformEventComponent;
    let fixture: ComponentFixture<SetTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetTransformEventComponent,
                DatasetKindPropertyComponent,
                SimplePropertyComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

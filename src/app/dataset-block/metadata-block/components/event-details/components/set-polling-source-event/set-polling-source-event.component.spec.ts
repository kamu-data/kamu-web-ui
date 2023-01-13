import { CardsPropertyComponent } from "./../common/cards-property/cards-property.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetPollingSourceEvent } from "../../mock.events";

import { SetPollingSourceEventComponent } from "./set-polling-source-event.component";
import { EditorPropertyComponent } from "../common/editor-property/editor-property.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { EnvVariablesPropertyComponent } from "../common/env-variables-property/env-variables-property.component";
import { LinkPropertyComponent } from "../common/link-property/link-property.component";
import { SchemaPropertyComponent } from "../common/schema-property/schema-property.component";
import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";

describe("SetPollingSourceEventComponent", () => {
    let component: SetPollingSourceEventComponent;
    let fixture: ComponentFixture<SetPollingSourceEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetPollingSourceEventComponent,
                SimplePropertyComponent,
                SeparatorPropertyComponent,
                LinkPropertyComponent,
                EnginePropertyComponent,
                EditorPropertyComponent,
                SchemaPropertyComponent,
                EnvVariablesPropertyComponent,
                CardsPropertyComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetPollingSourceEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetPollingSourceEvent;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

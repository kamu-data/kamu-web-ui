import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EnvVariablesPropertyComponent } from "./env-variables-property.component";

describe("EnvVariablesPropertyComponent", () => {
    let component: EnvVariablesPropertyComponent;
    let fixture: ComponentFixture<EnvVariablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnvVariablesPropertyComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(EnvVariablesPropertyComponent);
        component = fixture.componentInstance;
        component.data = [{ name: "testName", value: null }];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EnvVariablesPropertyComponent } from "./env-variables-property.component";

describe("EnvVariablesPropertyComponent", () => {
    let component: EnvVariablesPropertyComponent;
    let fixture: ComponentFixture<EnvVariablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnvVariablesPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EnvVariablesPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

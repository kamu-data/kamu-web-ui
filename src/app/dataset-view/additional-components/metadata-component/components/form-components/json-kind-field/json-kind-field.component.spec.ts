import { ComponentFixture, TestBed } from "@angular/core/testing";

import { JsonKindFieldComponent } from "./json-kind-field.component";

describe("JsonKindFieldComponent", () => {
    let component: JsonKindFieldComponent;
    let fixture: ComponentFixture<JsonKindFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JsonKindFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(JsonKindFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

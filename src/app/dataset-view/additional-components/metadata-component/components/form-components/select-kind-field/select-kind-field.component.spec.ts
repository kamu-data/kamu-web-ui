import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectKindFieldComponent } from "./select-kind-field.component";

describe("SelectKindFieldComponent", () => {
    let component: SelectKindFieldComponent;
    let fixture: ComponentFixture<SelectKindFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectKindFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectKindFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

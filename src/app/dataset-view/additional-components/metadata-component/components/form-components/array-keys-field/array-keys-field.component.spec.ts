import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArrayKeysFieldComponent } from "./array-keys-field.component";

describe("ArrayKeysFieldComponent", () => {
    let component: ArrayKeysFieldComponent;
    let fixture: ComponentFixture<ArrayKeysFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArrayKeysFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArrayKeysFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

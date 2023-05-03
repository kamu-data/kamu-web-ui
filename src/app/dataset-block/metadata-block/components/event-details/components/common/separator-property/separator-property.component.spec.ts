import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SeparatorPropertyComponent } from "./separator-property.component";

describe("SeparatorPropertyComponent", () => {
    let component: SeparatorPropertyComponent;
    let fixture: ComponentFixture<SeparatorPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SeparatorPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SeparatorPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

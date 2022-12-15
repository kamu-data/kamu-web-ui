import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddDataEventComponent } from "./add-data-event.component";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddDataEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

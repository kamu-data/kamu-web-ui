import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetKindPropertyComponent } from "./dataset-kind-property.component";

describe("DatasetKindPropertyComponent", () => {
    let component: DatasetKindPropertyComponent;
    let fixture: ComponentFixture<DatasetKindPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetKindPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetKindPropertyComponent);
        component = fixture.componentInstance;
        component.data = "ROOT";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

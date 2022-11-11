import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetsTabComponent } from "./datasets-tab.component";

describe("DatasetsTabComponent", () => {
    let component: DatasetsTabComponent;
    let fixture: ComponentFixture<DatasetsTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetsTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

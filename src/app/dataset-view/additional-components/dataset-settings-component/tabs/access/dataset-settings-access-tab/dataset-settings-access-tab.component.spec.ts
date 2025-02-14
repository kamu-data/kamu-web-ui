import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsAccessTabComponent } from "./dataset-settings-access-tab.component";

describe("DatasetSettingsAccessTabComponent", () => {
    let component: DatasetSettingsAccessTabComponent;
    let fixture: ComponentFixture<DatasetSettingsAccessTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetSettingsAccessTabComponent],
        });
        fixture = TestBed.createComponent(DatasetSettingsAccessTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

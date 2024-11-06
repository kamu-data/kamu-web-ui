import { MatIconModule } from "@angular/material/icon";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessExportTabComponent } from "./data-access-export-tab.component";

describe("DataAccessExportTabComponent", () => {
    let component: DataAccessExportTabComponent;
    let fixture: ComponentFixture<DataAccessExportTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessExportTabComponent],
            imports: [MatIconModule],
        });
        fixture = TestBed.createComponent(DataAccessExportTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

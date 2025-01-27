import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessOdataTabComponent } from "./data-access-odata-tab.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("DataAccessOdataTabComponent", () => {
    let component: DataAccessOdataTabComponent;
    let fixture: ComponentFixture<DataAccessOdataTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessOdataTabComponent],
            imports: [FormsModule, MatDividerModule, MatIconModule, HttpClientTestingModule],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessOdataTabComponent);
        component = fixture.componentInstance;
        component.odata = mockDatasetEndPoints.odata;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

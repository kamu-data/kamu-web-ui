import { mockDatasetEndPoints } from "./../../../data-access-panel-mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessSqlTabComponent } from "./data-access-sql-tab.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";

describe("DataAccessSqlTabComponent", () => {
    let component: DataAccessSqlTabComponent;
    let fixture: ComponentFixture<DataAccessSqlTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessSqlTabComponent],
            imports: [
                FormsModule,
                MatDividerModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        });
        fixture = TestBed.createComponent(DataAccessSqlTabComponent);
        component = fixture.componentInstance;
        component.flightSql = mockDatasetEndPoints.flightsql;
        component.jdbc = mockDatasetEndPoints.jdbc;
        component.postgreSql = mockDatasetEndPoints.postgresql;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
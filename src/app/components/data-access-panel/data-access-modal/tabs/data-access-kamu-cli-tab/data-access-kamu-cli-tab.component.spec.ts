import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessKamuCliTabComponent } from "./data-access-kamu-cli-tab.component";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";

describe("DataAccessKamuCliTabComponent", () => {
    let component: DataAccessKamuCliTabComponent;
    let fixture: ComponentFixture<DataAccessKamuCliTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessKamuCliTabComponent],
            imports: [
                FormsModule,
                MatDividerModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        });
        fixture = TestBed.createComponent(DataAccessKamuCliTabComponent);
        component = fixture.componentInstance;
        component.cli = mockDatasetEndPoints.cli;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
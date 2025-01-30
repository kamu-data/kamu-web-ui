import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessStreamTabComponent } from "./data-access-stream-tab.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("DataAccessStreamTabComponent", () => {
    let component: DataAccessStreamTabComponent;
    let fixture: ComponentFixture<DataAccessStreamTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessStreamTabComponent],
            imports: [FormsModule, MatDividerModule, MatIconModule, HttpClientTestingModule],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessStreamTabComponent);
        component = fixture.componentInstance;
        component.kafka = mockDatasetEndPoints.kafka;
        component.websocket = mockDatasetEndPoints.websocket;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

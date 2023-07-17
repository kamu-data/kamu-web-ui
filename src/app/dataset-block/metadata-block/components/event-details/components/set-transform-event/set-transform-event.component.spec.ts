import { ApolloTestingModule } from "apollo-angular/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetTransform } from "src/app/api/kamu.graphql.interface";
import { mockSetTransform } from "../../mock.events";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { SetTransformEventComponent } from "./set-transform-event.component";
import { TemporalTablesPropertyComponent } from "../common/temporal-tables-property/temporal-tables-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("SetTransformEventComponent", () => {
    let component: SetTransformEventComponent;
    let fixture: ComponentFixture<SetTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetTransformEventComponent,
                SimplePropertyComponent,
                EnginePropertyComponent,
                SqlQueryViewerComponent,
                TemporalTablesPropertyComponent,
            ],
            imports: [ApolloTestingModule, SharedTestModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetTransform as SetTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

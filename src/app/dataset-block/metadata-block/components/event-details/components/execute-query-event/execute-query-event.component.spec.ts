import { ExecuteQuery } from "./../../../../../../api/kamu.graphql.interface";
import { mockExecuteQuery } from "./../../mock.events";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ExecuteQueryEventComponent } from "./execute-query-event.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { SizePropertyComponent } from "../common/size-property/size-property.component";

describe("ExecuteQueryEventComponent", () => {
    let component: ExecuteQueryEventComponent;
    let fixture: ComponentFixture<ExecuteQueryEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExecuteQueryEventComponent, SizePropertyComponent],
            imports: [ApolloTestingModule, DisplaySizeModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ExecuteQueryEventComponent);
        component = fixture.componentInstance;
        component.event = mockExecuteQuery as ExecuteQuery;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

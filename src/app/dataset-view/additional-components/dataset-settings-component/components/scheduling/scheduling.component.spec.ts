import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SchedulingComponent } from "./scheduling.component";
import { ApolloModule } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "../../../../../common/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

describe("SchedulingComponent", () => {
    let component: SchedulingComponent;
    let fixture: ComponentFixture<SchedulingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchedulingComponent],
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                SharedTestModule,
                MatDividerModule,
                MatRadioModule,
                MatSlideToggleModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SchedulingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

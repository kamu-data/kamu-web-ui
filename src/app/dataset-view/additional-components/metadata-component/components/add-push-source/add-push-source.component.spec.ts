import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPushSourceComponent } from "./add-push-source.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("AddPushSourceComponent", () => {
    let component: AddPushSourceComponent;
    let fixture: ComponentFixture<AddPushSourceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPushSourceComponent],
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

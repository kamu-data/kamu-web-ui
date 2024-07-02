import { MatTableModule } from "@angular/material/table";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AceessTokensTabComponent } from "./aceess-tokens-tab.component";
import { FormBuilder, FormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";

describe("AccessTokensTabComponent", () => {
    let component: AceessTokensTabComponent;
    let fixture: ComponentFixture<AceessTokensTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AceessTokensTabComponent],
            providers: [FormBuilder, Apollo],
            imports: [
                ToastrModule.forRoot(),
                SharedTestModule,
                ApolloTestingModule,
                MatTableModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                FormsModule,
                MatDividerModule,
                HttpClientModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AceessTokensTabComponent);
        component = fixture.componentInstance;
        component.account = mockAccountDetails;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

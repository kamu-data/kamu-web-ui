import { MatTableModule } from "@angular/material/table";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccessTokensTabComponent } from "./access-tokens-tab.component";
import { FormBuilder, FormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { ToastrModule } from "ngx-toastr";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

describe("AccessTokensTabComponent", () => {
    let component: AccessTokensTabComponent;
    let fixture: ComponentFixture<AccessTokensTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccessTokensTabComponent],
            providers: [
                FormBuilder,
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return 2;
                                    }
                                },
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ToastrModule.forRoot(),
                ApolloTestingModule,
                MatTableModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                FormsModule,
                MatDividerModule,
                HttpClientModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccessTokensTabComponent);
        component = fixture.componentInstance;
        component.account = mockAccountDetails;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

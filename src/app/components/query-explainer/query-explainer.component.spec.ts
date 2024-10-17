import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QueryExplainerComponent } from "./query-explainer.component";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { Apollo } from "apollo-angular";

describe("QueryExplainerComponent", () => {
    let component: QueryExplainerComponent;
    let fixture: ComponentFixture<QueryExplainerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QueryExplainerComponent],
            imports: [HttpClientTestingModule, ToastrModule.forRoot()],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParams: of({
                                [ProjectLinks.URL_QUERY_PARAM_SQL_QUERY]: `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`,
                            }),
                        },
                    },
                },
            ],
        });
        fixture = TestBed.createComponent(QueryExplainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

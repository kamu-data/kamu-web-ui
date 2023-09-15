import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { LineageGraphComponent } from "./lineage-graph.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MOCK_LINKS, MOCK_NODES } from "src/app/api/mock/dataset.mock";
import { SimpleChange } from "@angular/core";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountService } from "src/app/services/account.service";
import { of } from "rxjs";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";

describe("LineageGraphComponent", () => {
    let component: LineageGraphComponent;
    let fixture: ComponentFixture<LineageGraphComponent>;
    let accountService: AccountService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageGraphComponent],
            providers: [Apollo],
            imports: [NgxGraphModule, BrowserAnimationsModule, ApolloModule, ApolloTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LineageGraphComponent);
        accountService = TestBed.inject(AccountService);
        component = fixture.componentInstance;
        component.view = [500, 600];
        component.links = MOCK_LINKS;
        component.nodes = MOCK_NODES;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check click on node", () => {
        const onClickNodeEventSpy = spyOn(component.onClickNodeEvent, "emit");
        component.onClickNode(MOCK_NODES[0]);
        expect(onClickNodeEventSpy).toHaveBeenCalledWith(MOCK_NODES[0]);
    });

    it("should check ngOnChanges", () => {
        component.ngOnChanges({
            nodes: new SimpleChange(MOCK_NODES, [MOCK_NODES[0]], false),
        });
        fixture.detectChanges();
        expect(component.graphNodes).toEqual([MOCK_NODES[0]]);
    });

    it("should check render account avatar", fakeAsync(() => {
        spyOn(accountService, "getAccountInfoByName").and.returnValue(of(mockAccountDetails));
        tick();
        fixture.detectChanges();
        const node = findElementByDataTestId(fixture, `account-avatar-${MOCK_NODES[0].label}`);
        expect(node).toBeDefined();
        flush();
    }));
});

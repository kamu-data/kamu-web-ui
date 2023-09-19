import { mockNode } from "../../../search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageComponent } from "./lineage.component";

import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockLineageUpdate } from "../data-tabs.mock";
import { first } from "rxjs/operators";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { ApolloModule } from "apollo-angular";
import { AccountService } from "src/app/services/account.service";
import { of } from "rxjs";

describe("LineageComponent", () => {
    let component: LineageComponent;
    let fixture: ComponentFixture<LineageComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let accountService: AccountService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageComponent],
            imports: [ApolloModule, SharedTestModule],
        }).compileComponents();

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);

        accountService = TestBed.inject(AccountService);
        spyOn(accountService, "fetchMultipleAccountsByName").and.returnValue(of());

        fixture = TestBed.createComponent(LineageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check click on Node", () => {
        const emitterSubscription$ = component.onClickNodeEmit.pipe(first()).subscribe((node: Node) => {
            expect(node).toEqual(mockNode);
        });

        component.onClickNode(mockNode);
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should check #ngOninit", () => {
        datasetSubsService.changeLineageData(mockLineageUpdate);
        component.ngOnInit();
        expect(component.isAvailableLineageGraph).toBeTrue();
    });
});

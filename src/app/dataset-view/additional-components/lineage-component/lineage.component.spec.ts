import { mockNode } from "../../../search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageComponent } from "./lineage.component";

import { first } from "rxjs/operators";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { ApolloModule } from "apollo-angular";
import { AccountService } from "src/app/services/account.service";
import { of } from "rxjs";
import { ToastrModule } from "ngx-toastr";
import { MOCK_NODES } from "src/app/api/mock/dataset.mock";

describe("LineageComponent", () => {
    let component: LineageComponent;
    let fixture: ComponentFixture<LineageComponent>;
    let accountService: AccountService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageComponent],
            imports: [ApolloModule, SharedTestModule, ToastrModule.forRoot()],
        }).compileComponents();

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

    it("should check click on private node", () => {
        const onClickPrivateNodeEmitSpy = spyOn(component.onClickPrivateNodeEmit, "emit");
        component.onClickPrivateNode(MOCK_NODES[2]);
        expect(onClickPrivateNodeEmitSpy).toHaveBeenCalledWith(MOCK_NODES[2]);
    });
});

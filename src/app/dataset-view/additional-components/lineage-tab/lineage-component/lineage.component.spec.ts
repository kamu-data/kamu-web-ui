
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageComponent } from "./lineage.component";

import { first } from "rxjs/operators";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { ApolloModule } from "apollo-angular";
import { AccountService } from "src/app/services/account.service";
import { of } from "rxjs";
import { ToastrModule } from "ngx-toastr";
import { mockNode } from "src/app/search/mock.data";

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
});

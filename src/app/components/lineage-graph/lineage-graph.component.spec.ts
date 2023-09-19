import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageGraphComponent } from "./lineage-graph.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MOCK_LINKS, MOCK_NODES } from "src/app/api/mock/dataset.mock";
import { ChangeDetectionStrategy, SimpleChange } from "@angular/core";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { LineageGraphNodeData } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { TEST_AVATAR_URL } from "src/app/api/mock/auth.mock";
import _ from "lodash";
import AppValues from "src/app/common/app.values";

describe("LineageGraphComponent", () => {
    let component: LineageGraphComponent;
    let fixture: ComponentFixture<LineageGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageGraphComponent],
            providers: [Apollo],
            imports: [NgxGraphModule, BrowserAnimationsModule, ApolloModule, ApolloTestingModule],
        })
            .overrideComponent(LineageGraphComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(LineageGraphComponent);
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

    it("should check render default account avatar", () => {
        const label: string = MOCK_NODES[0].label ?? "bad";
        const avatarElement = findElementByDataTestId(fixture, `account-avatar-${label}`);

        expect(avatarElement).toBeDefined();
        expect(avatarElement?.getAttribute("xlink:href")).toEqual(AppValues.DEFAULT_AVATAR_URL);
    });

    it("should check render custom account avatar", () => {
        const node = _.cloneDeep(MOCK_NODES[0]);
        const label: string = MOCK_NODES[0].label ?? "bad";

        (node.data as LineageGraphNodeData).dataObject.avatarUrl = TEST_AVATAR_URL;
        component.ngOnChanges({
            nodes: new SimpleChange(MOCK_NODES, [node], false),
        });

        fixture.detectChanges();

        const avatarElement = findElementByDataTestId(fixture, `account-avatar-${label}`);
        expect(avatarElement).toBeDefined();
        expect(avatarElement?.getAttribute("xlink:href")).toEqual(TEST_AVATAR_URL);
    });
});

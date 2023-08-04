import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageGraphComponent } from "./lineage-graph.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MOCK_CLUSTERS, MOCK_LINKS, MOCK_NODES } from "src/app/api/mock/dataset.mock";
import { SimpleChange } from "@angular/core";

describe("LineageGraphComponent", () => {
    let component: LineageGraphComponent;
    let fixture: ComponentFixture<LineageGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageGraphComponent],
            imports: [NgxGraphModule, BrowserAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LineageGraphComponent);
        component = fixture.componentInstance;
        component.view = [500, 600];
        component.links = MOCK_LINKS;
        component.nodes = MOCK_NODES;
        component.clusters = MOCK_CLUSTERS;
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
            clusters: new SimpleChange(MOCK_CLUSTERS, [MOCK_CLUSTERS[0]], false),
        });
        fixture.detectChanges();

        expect(component.graphNodes).toEqual([MOCK_NODES[0]]);
    });
});

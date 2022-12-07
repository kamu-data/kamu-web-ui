import { DatasetApi } from "src/app/api/dataset.api";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlockHeaderComponent } from "./block-header.component";
import { Apollo } from "apollo-angular";

describe("BlockHeaderComponent", () => {
    let component: BlockHeaderComponent;
    let fixture: ComponentFixture<BlockHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BlockHeaderComponent],
            providers: [Apollo, DatasetApi],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

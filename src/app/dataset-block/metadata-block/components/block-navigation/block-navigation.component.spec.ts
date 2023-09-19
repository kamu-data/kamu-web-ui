import { EventTypeFilterPipe } from "./pipes/event-type-filter.pipe";
import { BlockHashFilterPipe } from "./pipes/block-hash-filter.pipe";
import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { FormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockNavigationComponent } from "./block-navigation.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { dispatchInputEvent, getElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";
import { MatIconModule } from "@angular/material/icon";
import { DisplayHashModule } from "src/app/components/display-hash/dispaly-hash.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ToastrModule } from "ngx-toastr";

describe("BlockNavigationComponent", () => {
    let component: BlockNavigationComponent;
    let fixture: ComponentFixture<BlockNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BlockNavigationComponent, BlockHashFilterPipe, EventTypeFilterPipe],
            imports: [
                FormsModule,
                NgMultiSelectDropDownModule,
                PaginationModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                DisplayHashModule,
                ToastrModule.forRoot(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check clear search filter", () => {
        const testSearchHash = "Qwedfdfdfv";
        dispatchInputEvent(fixture, "searchHash", testSearchHash);
        expect(component.searchHash).toEqual(testSearchHash);

        const clearIcon = getElementByDataTestId(fixture, "clearSearchHash");
        clearIcon.click();

        expect(component.searchHash).toBe("");
    });

    it("should check calls highlightHash method", () => {
        const testSearchHash = "zW1";
        const highlightHashSpy = spyOn(component, "highlightHash").and.callThrough();
        component.datasetHistory = mockHistoryUpdate;

        dispatchInputEvent(fixture, "searchHash", testSearchHash);

        expect(highlightHashSpy).toHaveBeenCalledTimes(2);
    });

    it("should check change page number ", () => {
        const testPage = 2;
        const onPageChangeEmitSpy = spyOn(component.onPageChangeEmit, "emit");
        component.onPageChange(testPage);

        expect(onPageChangeEmitSpy).toHaveBeenCalledWith(testPage);
    });
});

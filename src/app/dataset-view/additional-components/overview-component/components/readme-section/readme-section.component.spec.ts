import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReadmeSectionComponent } from "./readme-section.component";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("ReadmeSectionComponent", () => {
    let component: ReadmeSectionComponent;
    let fixture: ComponentFixture<ReadmeSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            declarations: [ReadmeSectionComponent],
            imports: [ApolloModule, ApolloTestingModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ReadmeSectionComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EngineSectionComponent } from "./engine-section.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("EngineSectionComponent", () => {
    let component: EngineSectionComponent;
    let fixture: ComponentFixture<EngineSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineSectionComponent],
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

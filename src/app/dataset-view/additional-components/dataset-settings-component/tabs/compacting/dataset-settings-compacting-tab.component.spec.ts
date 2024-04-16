import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsCompactingTabComponent } from "./dataset-settings-compacting-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("DatasetSettingsCompactingTabComponent", () => {
    let component: DatasetSettingsCompactingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsCompactingTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsCompactingTabComponent, TooltipIconComponent],
            providers: [Apollo],
            imports: [
                ApolloTestingModule,
                MatDividerModule,
                ReactiveFormsModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                MatIconModule,
                NgbTooltipModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsCompactingTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

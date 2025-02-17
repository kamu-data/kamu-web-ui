import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { SettingsTabsEnum } from "../../../dataset-settings.model";
import { MatTableDataSource } from "@angular/material/table";
import { BaseComponent } from "src/app/common/components/base.component";
import { requireValue } from "src/app/common/helpers/app.helpers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddPeopleModalComponent } from "./add-people-modal/add-people-modal.component";

@Component({
    selector: "app-dataset-settings-access-tab",
    templateUrl: "./dataset-settings-access-tab.component.html",
    styleUrls: ["./dataset-settings-access-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsAccessTabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    public pageBasedInfo: PageBasedInfo;
    public readonly PER_PAGE = 15;
    public selectAll: boolean = false;

    public readonly DISPLAY_COLUMNS: string[] = ["user", "role", "actions"];
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;

    private navigationService = inject(NavigationService);
    private ngbModalService = inject(NgbModal);

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.dataSource.data = [
            { user: { id: "0", name: "Bill" }, role: { role: "Editor" } },
            { user: { id: "0", name: "John" }, role: { role: "Editor" } },
        ];
        this.pageBasedInfo = {
            currentPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 1,
        };
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public onPageChange(page: number): void {
        this.currentPage = page;
        this.navigationService.navigateToDatasetView({
            accountName: this.getDatasetInfoFromUrl().accountName,
            datasetName: this.getDatasetInfoFromUrl().datasetName,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.VARIABLES_AND_SECRETS,
            page: this.currentPage,
        });
    }

    public removeAll(): void {
        this.dataSource.data = [];
        this.selectAll = false;
    }

    public addPeople(): void {
        const modalRef = this.ngbModalService.open(AddPeopleModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddPeopleModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }
}

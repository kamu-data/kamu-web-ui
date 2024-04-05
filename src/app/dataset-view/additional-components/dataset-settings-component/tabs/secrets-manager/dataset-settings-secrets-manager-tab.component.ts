import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export interface EnvVariableElement {
    key: string;
    value: string;
}

const ELEMENT_DATA: EnvVariableElement[] = [
    { key: "key1", value: "value1" },
    { key: "key2", value: "value2" },
];

@Component({
    selector: "app-dataset-settings-secrets-manager-tab",
    templateUrl: "./dataset-settings-secrets-manager-tab.component.html",
    styleUrls: ["./dataset-settings-secrets-manager-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSecretsManagerTabComponent implements OnInit {
    public readonly DISPLAY_COLUMNS: string[] = ["key", "value", "actions"];
    public dataSource = new MatTableDataSource(ELEMENT_DATA);
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
}

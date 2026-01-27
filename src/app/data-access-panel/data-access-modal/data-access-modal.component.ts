/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DatasetBasicsFragment, DatasetEndpoints, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
import { Clipboard } from "@angular/cdk/clipboard";
import { DataAccessMenuItem, dataAccessMenuOptions, DataAccessTabsEnum } from "./data-access-modal.model";
import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ProtocolsService } from "src/app/services/protocols.service";
import { DataAccessExportTabComponent } from "./tabs/data-access-export-tab/data-access-export-tab.component";
import { DataAccessOdataTabComponent } from "./tabs/data-access-odata-tab/data-access-odata-tab.component";
import { DataAccessCodeTabComponent } from "./tabs/data-access-code-tab/data-access-code-tab.component";
import { DataAccessStreamTabComponent } from "./tabs/data-access-stream-tab/data-access-stream-tab.component";
import { DataAccessSqlTabComponent } from "./tabs/data-access-sql-tab/data-access-sql-tab.component";
import { DataAccessRestTabComponent } from "./tabs/data-access-rest-tab/data-access-rest-tab.component";
import { DataAccessKamuCliTabComponent } from "./tabs/data-access-kamu-cli-tab/data-access-kamu-cli-tab.component";
import { DataAccessLinkTabComponent } from "./tabs/data-access-link-tab/data-access-link-tab.component";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "../../common/directives/feature-flag.directive";
import { RouterLink } from "@angular/router";
import { NgIf, NgFor, AsyncPipe } from "@angular/common";

@Component({
    selector: "app-data-access-modal",
    templateUrl: "./data-access-modal.component.html",
    styleUrls: ["./data-access-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        RouterLink,
        NgFor,
        //-----//
        MatIconModule,
        //-----//
        DataAccessLinkTabComponent,
        DataAccessKamuCliTabComponent,
        DataAccessRestTabComponent,
        DataAccessSqlTabComponent,
        DataAccessStreamTabComponent,
        DataAccessCodeTabComponent,
        DataAccessOdataTabComponent,
        DataAccessExportTabComponent,
        FeatureFlagDirective,
    ]
})
export class DataAccessModalComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    private clipboard = inject(Clipboard);
    private appConfigService = inject(AppConfigService);
    private loggedUserService = inject(LoggedUserService);
    public activeModal = inject(NgbActiveModal);
    private protocolsService = inject(ProtocolsService);

    public protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;
    public accessDataOptions: DataAccessMenuItem[] = dataAccessMenuOptions;
    public activeTab: DataAccessTabsEnum = DataAccessTabsEnum.LINK;
    public readonly dataAccessTabsEnum: typeof DataAccessTabsEnum = DataAccessTabsEnum;
    public readonly datasetSettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly datasetViewType: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public navigateToSection(section: DataAccessTabsEnum): void {
        this.activeTab = section;
    }

    public ngOnInit(): void {
        this.initClipboardHints();
    }

    private initClipboardHints(): void {
        this.protocols$ = this.protocolsService.getProtocols({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public get showApiTokensLink(): boolean {
        return (
            this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
            this.loggedUserService.isAuthenticated &&
            this.datasetBasics.kind === DatasetKind.Root
        );
    }
}

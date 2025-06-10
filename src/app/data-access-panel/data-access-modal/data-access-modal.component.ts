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

@Component({
    selector: "app-data-access-modal",
    templateUrl: "./data-access-modal.component.html",
    styleUrls: ["./data-access-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import DataTabValues from "../../../dataset-view/additional-components/data-component/mock.data";

@Component({
    selector: "app-saved-queries-section",
    templateUrl: "./saved-queries-section.component.html",
    styleUrls: ["./saved-queries-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedQueriesSectionComponent {
    public savedQueries = DataTabValues.savedQueries;
}

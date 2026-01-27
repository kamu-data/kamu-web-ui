/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlightSqlDesc, JdbcDesc, PostgreSqlDesl } from "src/app/api/kamu.graphql.interface";
import { MatIconModule } from "@angular/material/icon";
import { CopyToClipboardComponent } from "../../../../common/components/copy-to-clipboard/copy-to-clipboard.component";

@Component({
    selector: "app-data-access-sql-tab",
    templateUrl: "./data-access-sql-tab.component.html",
    styleUrls: ["./data-access-sql-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
        //-----//
        CopyToClipboardComponent,
    ]
})
export class DataAccessSqlTabComponent {
    @Input({ required: true }) public flightSql: FlightSqlDesc;
    @Input({ required: true }) public jdbc: JdbcDesc;
    @Input({ required: true }) public postgreSql: PostgreSqlDesl;
}

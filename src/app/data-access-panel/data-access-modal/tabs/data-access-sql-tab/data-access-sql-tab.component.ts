/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataAccessBaseTabComponent } from "../../data-access-base-tab.component";
import { FlightSqlDesc, JdbcDesc, PostgreSqlDesl } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-sql-tab",
    templateUrl: "./data-access-sql-tab.component.html",
    styleUrls: ["./data-access-sql-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessSqlTabComponent extends DataAccessBaseTabComponent {
    @Input({ required: true }) public flightSql: FlightSqlDesc;
    @Input({ required: true }) public jdbc: JdbcDesc;
    @Input({ required: true }) public postgreSql: PostgreSqlDesl;
}

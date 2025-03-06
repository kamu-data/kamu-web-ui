/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { SqlQueryStep } from "src/app/api/kamu.graphql.interface";
import { ViewportScroller } from "@angular/common";

@Component({
    selector: "app-queries-section",
    templateUrl: "./queries-section.component.html",
    styleUrls: ["./queries-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueriesSectionComponent {
    @Input({ required: true }) public queries: Omit<SqlQueryStep, "__typename">[];

    private scroll = inject(ViewportScroller);

    public isLastQuery(index: number): boolean {
        return index === this.queries.length - 1;
    }

    public isBeforeLastQuery(index: number): boolean {
        return index === this.queries.length - 2;
    }

    public isFirstQuery(index: number): boolean {
        return index === 0;
    }

    public addQuery(): void {
        this.queries.unshift({
            alias: "",
            query: "",
        });
        this.scroll.scrollToPosition([0, 0]);
    }

    public deleteQuery(index: number): void {
        this.queries.splice(index, 1);
    }

    public swap(index: number, direction: number): void {
        const current = this.queries.find((_, i) => index === i);
        this.queries.splice(index, 1);
        if (current) {
            this.queries.splice(index + direction, 0, current);
        }
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { NgFor, NgClass, NgIf } from "@angular/common";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DynamicTableColumnDescriptor, DynamicTableDataRow } from "./dynamic-table.interface";
import { AttributesSchemaModalComponent } from "./components/attributes-schema-modal/attributes-schema-modal.component";

@Component({
    selector: "app-dynamic-table",
    templateUrl: "./dynamic-table.component.html",
    styleUrls: ["./dynamic-table.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgClass,
        NgFor,
        NgIf,

        //-----//
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        ClipboardModule,
        ToastrModule,
    ],
})
export class DynamicTableComponent implements OnInit, OnChanges {
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public dataRows: DynamicTableDataRow[];
    @Input({ required: true }) public idTable: string;
    @Input({ required: true }) public columnDescriptors: DynamicTableColumnDescriptor[];

    private readonly toastr = inject(ToastrService);
    private readonly ngbModalService = inject(NgbModal);

    public dataSource = new MatTableDataSource<DynamicTableDataRow>([]);

    public ngOnInit(): void {
        this.displayTable();
    }

    public get displayedColumns(): string[] {
        return this.columnDescriptors.map((item) => item.columnName);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.dataRows &&
            JSON.stringify(changes.dataRows.currentValue) !== JSON.stringify(changes.dataRows.previousValue)
        ) {
            this.displayTable();
        }
    }

    public get hasData(): boolean {
        return Boolean(this.dataRows?.length);
    }

    public trackByColumn(index: number, item: DynamicTableColumnDescriptor): string {
        return item.columnName;
    }

    private displayTable(): void {
        // Corner case - schema is empty, nothing to display
        if (this.displayedColumns.length === 0) {
            this.dataSource.data = [];
        } else {
            this.dataSource.data = this.dataRows;
        }
    }

    public showCopyMessage() {
        this.toastr.success(`Copied`);
    }

    public showMoreBadge(columnDescriptor: DynamicTableColumnDescriptor, element: DynamicTableDataRow): boolean {
        return Boolean(columnDescriptor.showMoreBadge) && Boolean(element["extraKeys"].value);
    }

    public extraDesription(element: DynamicTableDataRow): string {
        return "description" in element ? (element["description"].value as string) : "";
    }

    public showInfoBadge(columnDescriptor: DynamicTableColumnDescriptor, element: DynamicTableDataRow): boolean {
        return Boolean(columnDescriptor.showInfoBadge && this.extraDesription(element));
    }

    public showModal(element: DynamicTableDataRow): void {
        const modalRef = this.ngbModalService.open(AttributesSchemaModalComponent, {
            size: "lg",
            centered: true,
            scrollable: true,
        });
        const modalRefInstance = modalRef.componentInstance as AttributesSchemaModalComponent;
        modalRefInstance.element = element["extraKeys"].value;
    }
}

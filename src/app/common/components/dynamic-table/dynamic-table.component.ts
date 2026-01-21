/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterContentInit, ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { DataRow, DataSchemaField, OperationColumnClassEnum } from "src/app/interface/dataset.interface";
import { OdfExtraAttributes, TableSourceRowInterface } from "./dynamic-table.interface";
import { NgFor, NgClass, NgIf } from "@angular/common";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { OdfTypeMapper } from "../../helpers/data.helpers";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
        MatTableModule,
        ClipboardModule,
        ToastrModule,
    ],
})
export class DynamicTableComponent implements OnInit, OnChanges, AfterContentInit {
    @Input({ required: true }) public hasTableHeader: boolean;
    @Input({ required: true }) public schemaFields: DataSchemaField[];
    @Input() public dataRows?: DataRow[];
    @Input({ required: true }) public idTable: string;

    public dataSource = new MatTableDataSource<TableSourceRowInterface>([]);
    public displayedColumns: string[] = [];
    public readonly OperationColumnClassEnum: typeof OperationColumnClassEnum = OperationColumnClassEnum;
    private toastr = inject(ToastrService);
    private ngbModalService = inject(NgbModal);

    public ngOnInit(): void {
        this.displayTable();
    }

    public ngOnChanges(): void {
        this.displayTable();
    }

    public ngAfterContentInit(): void {
        this.displayTable();
    }

    public get hasData(): boolean {
        return Boolean(this.dataRows?.length);
    }

    private displayTable(): void {
        // Corner case - schema is empty, nothing to display
        if (this.schemaFields.length === 0) {
            this.dataSource.data = [];
            this.displayedColumns = [];

            // Special case: displaying schema itself
        } else if (!this.dataRows) {
            this.dataSource.data = this.schemaFields.map((x) => {
                return {
                    name: { value: x.name, cssClass: "" },
                    type: {
                        value:
                            x.extra && OdfExtraAttributes.EXTRA_ATTRIBUTE_TYPE in x.extra
                                ? x.extra[OdfExtraAttributes.EXTRA_ATTRIBUTE_TYPE].kind
                                : OdfTypeMapper(x.type),
                        cssClass: "",
                    },
                    description: {
                        value:
                            x.extra && OdfExtraAttributes.EXTRA_ATTRIBUTE_DESCRIPTION in x.extra
                                ? x.extra[OdfExtraAttributes.EXTRA_ATTRIBUTE_DESCRIPTION]
                                : "",
                        cssClass: "",
                    },
                };
            });
            this.displayedColumns = ["name", "type", "description"];

            // Casual case, displaying data
        } else {
            this.displayedColumns = this.schemaFields.map((f: DataSchemaField) => f.name);
            this.dataSource.data = this.dataRows;
        }
    }

    public showCopyMessage() {
        this.toastr.success(`Copied`);
    }

    public showBadge(indexRow: number, indexColumn: number, data: DataSchemaField[]): boolean {
        return (
            indexColumn === 1 &&
            !this.hasData &&
            (Boolean(Object.keys(data[indexRow].extra ?? {}).length) || Boolean(data[indexRow].type?.fields?.length))
        );
    }

    public showModal(index: number, data: DataSchemaField[]): void {
        const modalRef = this.ngbModalService.open(AttributesSchemaModalComponent, {
            size: "lg",
            centered: true,
            scrollable: true,
        });
        const modalRefInstance = modalRef.componentInstance as AttributesSchemaModalComponent;
        modalRefInstance.element = data[index];
    }
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountWithRole, DatasetAccessRole } from "src/app/api/kamu.graphql.interface";
import { CollaboratorModalResultType, ROLE_OPTIONS } from "../add-people-modal/add-people-modal.model";
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-edit-collaborator-modal",
    templateUrl: "./edit-collaborator-modal.component.html",
    styleUrls: ["./edit-collaborator-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatDividerModule, NgFor, FormsModule],
})
export class EditCollaboratorModalComponent implements OnInit {
    @Input({ required: true }) public collaborator: AccountWithRole;
    public role: DatasetAccessRole;
    public readonly SELECT_ROLE_OPTIONS = ROLE_OPTIONS;

    public activeModal = inject(NgbActiveModal);

    public ngOnInit(): void {
        if (this.collaborator) {
            this.role = this.collaborator.role;
        }
    }

    public saveChanges(): void {
        const result: CollaboratorModalResultType = {
            role: this.role,
            accountId: this.collaborator.account.id,
        };
        this.activeModal.close(result);
    }
}

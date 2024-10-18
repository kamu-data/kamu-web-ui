import { MaybeUndefined } from "./../../common/app.types";
import { ProtocolsService } from "./../../services/protocols.service";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, DatasetEndpoints } from "src/app/api/kamu.graphql.interface";
import { Clipboard } from "@angular/cdk/clipboard";
import { Observable } from "rxjs";
import { changeCopyIcon } from "src/app/common/app.helpers";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessPanelComponent implements OnInit {
    @Input({ required: true }) datasetBasics: DatasetBasicsFragment;
    public protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;

    private clipboard = inject(Clipboard);
    private protocolsService = inject(ProtocolsService);

    ngOnInit(): void {
        this.initClipboardHints();
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }

    private initClipboardHints(): void {
        this.protocols$ = this.protocolsService.getProtocols({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}

import { ToastrService } from "ngx-toastr";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetKind, Seed } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
    selector: "app-seed-event",
    templateUrl: "./seed-event.component.html",
    styleUrls: ["./seed-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedEventComponent {
    @Input() public event: Seed;

    constructor(
        private clipboard: Clipboard,
        private toastService: ToastrService,
    ) {}

    public datasetKind(kind: DatasetKind): string {
        return DataHelpers.capitalizeFirstLetter(kind);
    }

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastService.success("Copied");
    }
}

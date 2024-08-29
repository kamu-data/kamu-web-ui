import { ToastrService } from "ngx-toastr";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Seed } from "src/app/api/kamu.graphql.interface";
import { Clipboard } from "@angular/cdk/clipboard";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-seed-event",
    templateUrl: "./seed-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedEventComponent extends BaseComponent {
    @Input({ required: true }) public event: Seed;

    constructor(
        private clipboard: Clipboard,
        private toastService: ToastrService,
    ) {
        super();
    }

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastService.success("Copied");
    }
}

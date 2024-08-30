import { ToastrService } from "ngx-toastr";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
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

    private clipboard = inject(Clipboard);
    private toastService = inject(ToastrService);

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastService.success("Copied");
    }
}

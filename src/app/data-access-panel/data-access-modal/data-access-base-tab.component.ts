import { inject } from "@angular/core";
import { changeCopyIcon } from "src/app/common/helpers/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";

export abstract class DataAccessBaseTabComponent {
    private clipboard = inject(Clipboard);

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }
}

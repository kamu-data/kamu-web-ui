import { inject } from "@angular/core";
import { changeCopyIcon } from "src/app/common/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";

export abstract class DataAccessBaseTabComponent {
    protected clipboard = inject(Clipboard);

    protected copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }
}

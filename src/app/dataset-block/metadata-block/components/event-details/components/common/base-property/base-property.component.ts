import { Injectable, Input } from "@angular/core";

@Injectable()
export abstract class BasePropertyComponent {
    @Input() public data: unknown;
    @Input() public dataTestId?: string;
}

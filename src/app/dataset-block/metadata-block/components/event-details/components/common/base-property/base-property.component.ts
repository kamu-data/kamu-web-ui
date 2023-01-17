import { Injectable, Input } from "@angular/core";

@Injectable()
export abstract class BasePropertyComponent {
    @Input() public dataTestId?: string;
}

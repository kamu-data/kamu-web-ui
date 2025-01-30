import { BaseComponent } from "src/app/common/components/base.component";
import { Injectable, Input } from "@angular/core";

@Injectable()
export abstract class BasePropertyComponent extends BaseComponent {
    @Input() public dataTestId?: string;
}

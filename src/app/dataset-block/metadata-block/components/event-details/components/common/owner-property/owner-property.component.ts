import { Account } from "./../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-owner-property",
    templateUrl: "./owner-property.component.html",
    styleUrls: ["./owner-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerPropertyComponent extends BasePropertyComponent {
    @Input() public data: Account;
}

import { NavigationService } from "../../../../../../../services/navigation.service";
import { Account } from "../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-owner-property",
    templateUrl: "./owner-property.component.html",
    styleUrls: ["./owner-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerPropertyComponent extends BasePropertyComponent {
    @Input() public data: Account;

    constructor(private navigationService: NavigationService) {
        super();
    }

    public showOwner(): void {
        this.navigationService.navigateToOwnerView(this.data.name);
    }
}

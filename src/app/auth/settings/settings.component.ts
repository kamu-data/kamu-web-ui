import { MaybeNull } from "./../../common/app.types";
import { AccountDetailsFragment } from "src/app/api/kamu.graphql.interface";
import { AuthApi } from "src/app/api/auth.api";
import { SettingsTabs } from "./settings.constants";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent extends BaseComponent implements OnInit {
    public activeTab: string | undefined = SettingsTabs.PROFILE;
    public settingsTabs: typeof SettingsTabs = SettingsTabs;
    public user: MaybeNull<AccountDetailsFragment>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authApi: AuthApi,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.activeTab = this.route.snapshot.routeConfig?.path;
                }),
        );
        this.activeTab = this.route.snapshot.routeConfig?.path;
        this.user = this.authApi.currentUser;
    }
}

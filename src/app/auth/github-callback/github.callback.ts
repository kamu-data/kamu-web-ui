import { NavigationService } from "./../../services/navigation.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthApi } from "../../api/auth.api";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-github-callback",
    templateUrl: "./github-callback.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubCallbackComponent extends BaseComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private authApi: AuthApi,
    ) {
        super();
    }

    ngOnInit() {
        if (!this.searchString.includes("?code=")) {
            this.navigationService.navigateToHome();
        }
        this.trackSubscription(
            this.route.queryParams.subscribe((param: Params) => {
                this.authApi
                    .fetchUserInfoAndTokenFromGithubCallackCode(
                        param.code as string,
                    )
                    .subscribe(() => this.navigationService.navigateToHome());
            }),
        );
    }
}

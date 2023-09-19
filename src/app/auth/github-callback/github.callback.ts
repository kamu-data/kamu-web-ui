import { NavigationService } from "../../services/navigation.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { BaseComponent } from "src/app/common/base.component";
import { LoginService } from "../login/login.service";
import { GithubLoginCredentials } from "src/app/api/auth.api.model";

@Component({
    selector: "app-github-callback",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubCallbackComponent extends BaseComponent implements OnInit {
    public constructor(
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private loginService: LoginService,
    ) {
        super();
    }

    public ngOnInit() {
        if (!this.searchString.includes("?code=")) {
            this.navigationService.navigateToHome();
        }
        this.trackSubscription(
            this.route.queryParams.subscribe((param: Params) => {
                this.loginService.githubLogin({ code: param.code as string } as GithubLoginCredentials);
            }),
        );
    }
}

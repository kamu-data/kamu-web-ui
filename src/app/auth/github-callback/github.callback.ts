import { NavigationService } from "../../services/navigation.service";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { BaseComponent } from "src/app/common/components/base.component";
import { LoginService } from "../login/login.service";
import { GithubLoginCredentials } from "src/app/api/auth.api.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-github-callback",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubCallbackComponent extends BaseComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private navigationService = inject(NavigationService);
    private loginService = inject(LoginService);

    public ngOnInit() {
        if (!this.searchString.includes("?code=")) {
            this.navigationService.navigateToHome();
        }

        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((param: Params) => {
            this.loginService.githubLogin({ code: param.code as string } as GithubLoginCredentials);
        });
    }
}

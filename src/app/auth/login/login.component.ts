import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
    public appLogo = `/${AppValues.APP_LOGO}`;
    public githubUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${environment.github_client_id}`;
    public enableFormLoginFromServer = true;
    public showFormLogin = false;

    ngOnInit(): void {
        if (!this.enableFormLoginFromServer) {
            window.location.href = this.githubUrl;
        }
    }

    public clickLogin(): void {
        this.showFormLogin = true;
    }
}

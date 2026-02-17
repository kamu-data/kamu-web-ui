/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";

import { BaseComponent } from "@common/components/base.component";
import { GithubLoginCredentials } from "src/app/api/auth.api.model";
import ProjectLinks from "src/app/project-links";

import { NavigationService } from "../../../services/navigation.service";
import { LoginService } from "../login.service";

@Component({
    selector: "app-github-callback",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class GithubCallbackComponent extends BaseComponent implements OnInit {
    @Input(ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL) public redirectUrl: string;
    @Input(ProjectLinks.URL_QUERY_PARAM_CODE) public set code(value: string) {
        if (value) {
            this.loginService.githubLogin({ code: value } as GithubLoginCredentials, this.redirectUrl);
        }
    }

    private navigationService = inject(NavigationService);
    private loginService = inject(LoginService);

    public ngOnInit() {
        if (!this.searchString.includes("?code=")) {
            if (this.redirectUrl) {
                this.navigationService.navigateToLogin(this.redirectUrl);
            } else {
                this.navigationService.navigateToHome();
            }
        }
    }
}

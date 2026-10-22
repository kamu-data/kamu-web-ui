/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";

import { BaseComponent } from "@common/components/base.component";

import { LoginService } from "src/app/auth/login/login.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-github-callback",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubCallbackComponent extends BaseComponent implements OnInit {
    // GitHub returns the `state` of the authorization request unchanged; it holds the page to return to
    @Input(ProjectLinks.URL_QUERY_PARAM_STATE) public redirectUrl: string;
    @Input(ProjectLinks.URL_QUERY_PARAM_CODE) public code: string;

    private navigationService = inject(NavigationService);
    private loginService = inject(LoginService);

    public ngOnInit() {
        if (this.code) {
            this.loginService.githubLogin({ code: this.code }, this.redirectUrl);
        } else if (this.redirectUrl) {
            this.navigationService.navigateToLogin(this.redirectUrl);
        } else {
            this.navigationService.navigateToHome();
        }
    }
}

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
import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
    selector: "app-github-callback",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubCallbackComponent extends BaseComponent implements OnInit {
    @Input(ProjectLinks.URL_QUERY_PARAM_CODE) public code: string;
    @Input(ProjectLinks.URL_QUERY_PARAM_STATE) public state: string;

    private navigationService = inject(NavigationService);
    private loginService = inject(LoginService);
    private sessionStorageService = inject(SessionStorageService);

    public ngOnInit() {
        const pendingLogin = this.sessionStorageService.takeGithubLoginState();
        const redirectUrl = pendingLogin?.redirectUrl ?? null;
        // Only a code for the sign-in this tab started is accepted, so a link with someone else's code signs nobody in
        if (this.code && this.state && this.state === pendingLogin?.state) {
            this.loginService.githubLogin({ code: this.code }, redirectUrl);
        } else if (redirectUrl) {
            this.navigationService.navigateToLogin(redirectUrl);
        } else {
            this.navigationService.navigateToHome();
        }
    }
}

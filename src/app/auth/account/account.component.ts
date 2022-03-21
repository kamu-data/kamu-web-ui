import {Component, OnInit} from "@angular/core";
import {UserInterface} from "../../interface/auth.interface";
import AppValues from "../../common/app.values";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthApi} from "../../api/auth.api";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
})
export class AccountComponent implements OnInit {

    public user: UserInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authApi: AuthApi,
    ) {
        if (this.authApi.userModal) {
            this.user = AppValues.deepCopy(this.authApi.userModal);
        }
        this.authApi.onUserChanges.subscribe((user: UserInterface | {}) => {
            this.user = AppValues.deepCopy(user);
        });
    }

    public ngOnInit(): void {
        if (!this.user) {
            this.router.navigate(["/"]);
        }
    }

    public onUserProfile(): void {
        if (this.user && this.user.login) {
            this.router.navigate([this.user.login]);
        }
    }

    public onUserDatasets(): void {
        debugger
        if (this.user && this.user.login) {
            this.router.navigate([this.user.login], {
                queryParams: {tab: "datasets"}
            });
        }
    }

    public onUserOrganizations(): void {
        if (this.user && this.user.login) {
            this.router.navigate([this.user.login], {
                queryParams: {tab: "organizations"}
            });
        }
    }

    public onUserInbox(): void {
        if (this.user && this.user.login) {
            this.router.navigate([this.user.login], {
                queryParams: {tab: "inbox"}
            });
        }
    }

    public onUserStars(): void {
        debugger
        if (this.user && this.user.login) {
            this.router.navigate([this.user.login], {
                queryParams: {tab: "stars"}
            });
        }
    }
}

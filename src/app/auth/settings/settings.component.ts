import {Component, OnInit} from "@angular/core";
import {UserInterface} from "../../interface/auth.interface";
import AppValues from "../../common/app.values";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthApi} from "../../api/auth.api";
import {SearchApi} from "../../api/search.api";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["settings.component.sass"]
})
export class SettingsComponent implements OnInit {

    public user: UserInterface;
    private _window: Window;

    constructor(
        private searchApi: SearchApi,
        private authApi: AuthApi,
    ) {
        this._window = window;
        if (this.authApi.userModal) {
            this.user = AppValues.deepCopy(this.authApi.userModal);
        }
        this.authApi.onUserChanges.subscribe((user: UserInterface | {}) => {
            this.user = AppValues.deepCopy(user);
        });
    }

    public ngOnInit(): void {
    }
}

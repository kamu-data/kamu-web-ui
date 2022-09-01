import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SpinnerService {
    private _isLoading$ = new Subject<boolean>();
    public get isLoading$() {
        return this._isLoading$.asObservable();
    }

    show(): void {
        this._isLoading$.next(true);
    }
    hide(): void {
        this._isLoading$.next(false);
    }
}

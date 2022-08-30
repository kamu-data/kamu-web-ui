import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SpinnerService {
    isLoading$ = new Subject<boolean>();

    show(): void {
        this.isLoading$.next(true);
    }
    hide(): void {
        this.isLoading$.next(false);
    }
}

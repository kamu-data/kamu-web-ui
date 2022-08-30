import { SpinnerService } from "./spinner.service";
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize, delay } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export class SpinnerInterceptor implements HttpInterceptor {
    constructor(private spinnerService: SpinnerService) {}
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        this.spinnerService.show();
        return next.handle(req).pipe(
            delay(environment.delay_http_request),
            finalize(() => this.spinnerService.hide()),
        );
    }
}

import { SpinnerService } from "./spinner.service";
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Observable, identity } from "rxjs";
import { finalize, delay } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export class SpinnerInterceptor implements HttpInterceptor {
    constructor(private spinnerService: SpinnerService) {}
    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        this.spinnerService.show();
        return next.handle(req).pipe(
            environment.delay_http_request_ms > 0 
                ? delay(environment.delay_http_request_ms)
                : identity,
            finalize(() => this.spinnerService.hide()),
        );
    }
}

import { SpinnerService } from "./spinner.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import AppValues from "src/app/common/values/app.values";
import { inject } from "@angular/core";

export class SpinnerInterceptor implements HttpInterceptor {
    private spinnerService = inject(SpinnerService);
    private timer: NodeJS.Timer;
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const skipGlobalLoader = Boolean(req.headers.get(AppValues.HEADERS_SKIP_LOADING_KEY));
        if (req.url.includes("/assets") || skipGlobalLoader) {
            return next.handle(req);
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.spinnerService.show(), environment.delay_http_request_ms);
        return next.handle(req).pipe(
            finalize(() => {
                this.spinnerService.hide();
                clearTimeout(this.timer);
            }),
        );
    }
}

import { SpinnerService } from "./spinner.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export class SpinnerInterceptor implements HttpInterceptor {
    constructor(private spinnerService: SpinnerService) {}
    timer: NodeJS.Timer;
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.url.includes("/assets")) {
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

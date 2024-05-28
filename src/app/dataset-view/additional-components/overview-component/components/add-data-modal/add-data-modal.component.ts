import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { MaybeNull } from "src/app/common/app.types";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent implements OnInit {
    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private localStorageService: LocalStorageService,
        private http: HttpClient,
    ) {
        super();
    }

    ngOnInit(): void {}

    public onFileSelected(event: Event): Promise<MaybeNull<string>> {
        return new Promise<string>((resolve) => {
            const input = event.target as HTMLInputElement;
            if (!input.files?.length) {
                resolve("");
            } else {
                const file: File = input.files[0];

                interface UploadGetResponse {
                    uploadUrl: string;
                    method: "POST" | "PUT";
                    headers: [string, string][];
                    fields: [string, string][];
                }

                const getHeaders = { Authorization: `Bearer ${this.localStorageService.accessToken}` };
                const uploadGet$: Observable<UploadGetResponse> = this.http.get<UploadGetResponse>(
                    "http://localhost:8080/platform/file/upload?fileName=" + file.name + "&contentLength=" + file.size,
                    { headers: getHeaders },
                );

                uploadGet$.subscribe((response: UploadGetResponse) => {
                    let uploadHeaders = new HttpHeaders();
                    response.headers.forEach((header: [string, string]) => {
                        uploadHeaders = uploadHeaders.append(header[0], header[1]);
                    });

                    const formData = new FormData();
                    response.fields.forEach((field: [string, string]) => {
                        formData.append(field[0], field[1]);
                    });
                    formData.append("file", file);

                    let upload$: Observable<object>;
                    switch (response.method) {
                        case "POST":
                            upload$ = this.http.post(response.uploadUrl, formData, { headers: uploadHeaders });
                            break;
                        case "PUT":
                            upload$ = this.http.put(response.uploadUrl, formData, { headers: uploadHeaders });
                            break;
                        default:
                            throw new Error("Unexpected upload method");
                    }
                    upload$.subscribe(() => {
                        console.log("Upload done");
                    });
                });
            }
        });
    }

    public onAddUrl(): void {
        const modalRef: NgbModalRef = this.modalService.open(FileFromUrlModalComponent);
        const modalRefInstance = modalRef.componentInstance as FileFromUrlModalComponent;
        this.activeModal.close();
    }
}

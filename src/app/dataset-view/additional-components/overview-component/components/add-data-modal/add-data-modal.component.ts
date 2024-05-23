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

                interface UploadFormField {
                    name: string;
                    value: string;
                }

                interface UploadGetResponse {
                    uploadUrl: string;
                    method: "POST" | "PUT";
                    fields: UploadFormField[];
                }

                const getHeaders = { Authorization: `Bearer ${this.localStorageService.accessToken}` };
                const uploadGet$: Observable<UploadGetResponse> = this.http.get<UploadGetResponse>(
                    "http://localhost:8080/platform/file/upload?file_name=" + file.name,
                    { headers: getHeaders },
                );

                uploadGet$.subscribe((response: UploadGetResponse) => {
                    const formData = new FormData();
                    formData.append("thumbnail", file);

                    // TODO: use fields
                    let uploadHeaders = new HttpHeaders();
                    uploadHeaders = uploadHeaders.append(
                        "Authorization",
                        `Bearer ${this.localStorageService.accessToken}`,
                    );
                    response.fields.forEach((field: UploadFormField) => {
                        uploadHeaders = uploadHeaders.append(field.name, field.value);
                    });

                    let upload$: Observable<object>;
                    switch (response.method) {
                        case "POST":
                            upload$ = this.http.post(response.uploadUrl, formData, { headers: uploadHeaders });
                            break;
                        case "PUT":
                            upload$ = this.http.put(response.uploadUrl, formData, { headers: uploadHeaders });
                            break;
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

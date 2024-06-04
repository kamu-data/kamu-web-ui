import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { MaybeNull } from "src/app/common/app.types";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;

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

                interface UploadPrepareResponse {
                    uploadToken: string;
                    uploadUrl: string;
                    method: "POST" | "PUT";
                    headers: [string, string][];
                    fields: [string, string][];
                }

                const authHeaders = { Authorization: `Bearer ${this.localStorageService.accessToken}` };
                const uploadPrepare$: Observable<UploadPrepareResponse> = this.http.post<UploadPrepareResponse>(
                    "http://localhost:8080/platform/file/upload/prepare?fileName=" +
                        file.name +
                        "&contentLength=" +
                        file.size +
                        "&contentType=" +
                        file.type,
                    null,
                    { headers: authHeaders },
                );

                uploadPrepare$.subscribe((uploadPrepareResponse: UploadPrepareResponse) => {
                    let uploadHeaders = new HttpHeaders();
                    uploadPrepareResponse.headers.forEach((header: [string, string]) => {
                        uploadHeaders = uploadHeaders.append(header[0], header[1]);
                    });

                    const formData = new FormData();
                    uploadPrepareResponse.fields.forEach((field: [string, string]) => {
                        formData.append(field[0], field[1]);
                    });
                    formData.append("file", file);

                    let upload$: Observable<object>;
                    switch (uploadPrepareResponse.method) {
                        case "POST":
                            upload$ = this.http.post(uploadPrepareResponse.uploadUrl, formData, {
                                headers: uploadHeaders,
                            });
                            break;
                        case "PUT":
                            upload$ = this.http.put(uploadPrepareResponse.uploadUrl, formData, {
                                headers: uploadHeaders,
                            });
                            break;
                        default:
                            throw new Error("Unexpected upload method");
                    }
                    upload$.subscribe(() => {
                        console.log(`Upload with token ${uploadPrepareResponse.uploadToken} done`);

                        const ingest$: Observable<object> = this.http.post<object>(
                            `http://localhost:8080/${this.datasetBasics.owner.accountName}/${this.datasetBasics.name}/ingest?uploadToken=${uploadPrepareResponse.uploadToken}`,
                            null,
                            { headers: authHeaders },
                        );
                        ingest$.subscribe((ingestResponse: object) => {
                            console.log(`Ingest complete: ${JSON.stringify(ingestResponse)}`);
                        });
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

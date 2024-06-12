import { NavigationService } from "src/app/services/navigation.service";
import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { UploadAvailableMethod, UploadPerareData, UploadPrepareResponse } from "src/app/common/app.types";
import { HttpHeaders } from "@angular/common/http";
import { Observable, of, switchMap, tap } from "rxjs";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { FileUploadService } from "src/app/services/file-upload.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { APOLLO_OPTIONS } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    private uploadToken: string;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private fileUploadService: FileUploadService,
        private navigationService: NavigationService,
        private datasetService: DatasetService,
        private injector: Injector,
    ) {
        super();
    }

    ngOnInit(): void {}

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            const file: File = input.files[0];
            const uploadPrepare$: Observable<UploadPrepareResponse> = this.fileUploadService.uploadFilePrepare(file);
            this.trackSubscription(
                uploadPrepare$
                    .pipe(
                        tap((data) => (this.uploadToken = data.uploadToken)),
                        switchMap((uploadPrepareResponse: UploadPrepareResponse) =>
                            this.prepareUploadData(uploadPrepareResponse, file),
                        ),
                        switchMap(({ uploadPrepareResponse, bodyObject, uploadHeaders }: UploadPerareData) =>
                            this.uploadFileByMethod(
                                uploadPrepareResponse.method,
                                uploadPrepareResponse.uploadUrl,
                                bodyObject,
                                uploadHeaders,
                            ),
                        ),
                        switchMap(() =>
                            this.fileUploadService.ingestDataToDataset(
                                {
                                    accountName: this.datasetBasics.owner.accountName,
                                    datasetName: this.datasetBasics.name,
                                },
                                this.uploadToken,
                            ),
                        ),
                    )
                    .subscribe(() => {
                        this.activeModal.close();
                        this.updatePage(this.datasetBasics.owner.accountName, this.datasetBasics.name);
                    }),
            );
        }
    }

    private updatePage(accountName: string, datasetName: string): void {
        this.updateCache();
        this.datasetService
            .requestDatasetMainData({
                accountName,
                datasetName,
            })
            .subscribe();
        this.navigationService.navigateToDatasetView({
            accountName,
            datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    private updateCache(): void {
        const cache = this.injector.get(APOLLO_OPTIONS).cache;
        if (cache) {
            const datasetKeyFragment = DatasetApi.generateDatasetKeyFragment(
                cache.identify(DatasetApi.generateAccountKeyFragment(this.datasetBasics.owner.id)),
                this.datasetBasics.id,
            );
            cache.evict({
                id: cache.identify(datasetKeyFragment),
                fieldName: "data",
            });
        }
    }

    public onAddUrl(): void {
        this.modalService.open(FileFromUrlModalComponent);
        this.activeModal.close();
    }

    private prepareUploadData(uploadPrepareResponse: UploadPrepareResponse, file: File): Observable<UploadPerareData> {
        let uploadHeaders = new HttpHeaders();
        uploadPrepareResponse.headers.forEach((header: [string, string]) => {
            uploadHeaders = uploadHeaders.append(header[0], header[1]);
        });
        let bodyObject: FormData | File;
        if (uploadPrepareResponse.useMultipart) {
            const formData = new FormData();
            uploadPrepareResponse.fields.forEach((field: [string, string]) => {
                formData.append(field[0], field[1]);
            });
            formData.append("file", file);
            bodyObject = formData;
        } else {
            bodyObject = file;
        }
        return of({
            uploadPrepareResponse,
            bodyObject,
            uploadHeaders,
        });
    }

    private uploadFileByMethod(
        method: UploadAvailableMethod,
        uploadUrl: string,
        bodyObject: File | FormData,
        uploadHeaders: HttpHeaders,
    ): Observable<object> {
        switch (method) {
            case "POST":
                return this.fileUploadService.uploadPostFile(uploadUrl, bodyObject, uploadHeaders);
            case "PUT":
                return this.fileUploadService.uploadPutFile(uploadUrl, bodyObject, uploadHeaders);
            default:
                throw new Error("Unexpected upload method");
        }
    }
}

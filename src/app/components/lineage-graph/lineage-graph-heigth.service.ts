import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class LineageGraphHeigthService {
    private componentsPaddings = 90;
    private _datasetViewHeaderHeight = 0;
    public setDatasetViewHeaderHeight(value: number): number {
        return (this._datasetViewHeaderHeight = value);
    }
    public get datasetViewHeaderHeight(): number {
        return this._datasetViewHeaderHeight;
    }

    private _appHeaderHeight = 0;
    public setAppHeaderHeight(value: number): number {
        return (this._appHeaderHeight = value);
    }
    public get appHeaderHeight(): number {
        return this._appHeaderHeight;
    }

    private _datasetViewMenuHeight = 0;
    public setDatasetViewMenuHeight(value: number): number {
        return (this._datasetViewMenuHeight = value);
    }
    public get datasetViewMEnuHeight(): number {
        return this._datasetViewMenuHeight;
    }

    public get lineageGraphHeigth(): number {
        return (
            window.innerHeight -
            (this.datasetViewHeaderHeight + this.appHeaderHeight + this.datasetViewMEnuHeight + this.componentsPaddings)
        );
    }
}

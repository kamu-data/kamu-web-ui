import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class WidgetHeightService {
    // Margin top and bottom for the lineage graph
    private readonly WIDGET_MARGIN_Y = 30;
    private widgetOffsetTop = 0;

    public setWidgetOffsetTop(value: number): void {
        this.widgetOffsetTop = value;
    }

    public get widgetHeigth(): number {
        return window.innerHeight - this.widgetOffsetTop - 2 * this.WIDGET_MARGIN_Y;
    }
}

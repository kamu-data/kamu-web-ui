import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "displayDatasetId",
})
export class DisplayDatasetIdPipe implements PipeTransform {
    transform(id: string): string {
        return id.slice(0, 11) + "..." + id.slice(-7);
    }
}

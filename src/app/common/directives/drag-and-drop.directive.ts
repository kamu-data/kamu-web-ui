import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
    selector: "[appDragAndDrop]",
})
export class DragAndDropDirective {
    @Output() public fileDropped = new EventEmitter<FileList>();

    @HostListener("dragover", ["$event"]) public onDragOver(event: DragEvent): void {
        event.stopPropagation();
        event.preventDefault();
    }

    @HostListener("drop", ["$event"]) public onDrop(event: DragEvent): void {
        event.stopPropagation();
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files?.length) {
            this.fileDropped.emit(files);
        }
    }

    @HostListener("dragleave", ["$event"]) public onDragLeave(event: DragEvent): void {
        event.stopPropagation();
        event.preventDefault();
    }
}

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent implements OnInit {
    ngOnInit(): void {
        console.log("work");
    }
}

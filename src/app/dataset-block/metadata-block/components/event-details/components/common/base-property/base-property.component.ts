import { Component, Input } from "@angular/core";

@Component({
    template: "",
})
export abstract class BasePropertyComponent {
    @Input() public data: unknown;
    @Input() public class?: string;
}

import { EnvVar } from "./../../../../../../../api/kamu.graphql.interface";
import { Injectable, Input } from "@angular/core";

@Injectable()
export abstract class BasePropertyComponent {
    @Input() public data: unknown | string[] | EnvVar[];
}

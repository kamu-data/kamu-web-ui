import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatureFlagDirective } from "./feature-flag.directive";

@NgModule({
    declarations: [FeatureFlagDirective],
    exports: [FeatureFlagDirective],
    imports: [CommonModule],
})
export class FeatureFlagModule {}

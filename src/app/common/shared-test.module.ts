import { NgModule } from "@angular/core";
import { snapshotParamMapMock } from "./base-test.helpers.spec";

@NgModule({
    providers: [snapshotParamMapMock],
})
export class SharedTestModule {}

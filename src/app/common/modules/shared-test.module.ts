import { NgModule } from "@angular/core";
import { snapshotParamMapMock } from "../helpers/base-test.helpers.spec";

@NgModule({
    providers: [snapshotParamMapMock],
})
export class SharedTestModule {}

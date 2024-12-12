import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LineageComponent } from './lineage-component/lineage.component'

const routes: Routes = [{ path: '', component: LineageComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LineageTabRoutingModule {}

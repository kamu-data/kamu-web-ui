import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { OverviewComponent } from './components/overview-component/overview.component'

const routes: Routes = [{ path: '', component: OverviewComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewTabRoutingModule {}

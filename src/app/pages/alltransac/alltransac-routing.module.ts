import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlltransacPage } from './alltransac.page';

const routes: Routes = [
  {
    path: '',
    component: AlltransacPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlltransacPageRoutingModule {}

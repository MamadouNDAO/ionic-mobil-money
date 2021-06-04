import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculPage } from './calcul.page';

const routes: Routes = [
  {
    path: '',
    component: CalculPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculPageRoutingModule {}

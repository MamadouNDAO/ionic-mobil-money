import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HostPage } from './host.page';
import {PrincipalPage} from '../principal/principal.page';
import {DepotPage} from '../depot/depot.page';
import {CalculPage} from '../calcul/calcul.page';
import {CommissionPage} from '../commission/commission.page';
import {TransactionPage} from '../transaction/transaction.page';
import {AlltransacPage} from '../alltransac/alltransac.page';

const routes: Routes = [
  {
    path: '',
    component: HostPage,
    children: [
      {path: 'principal', component: PrincipalPage},
      {path: 'calcul', component: CalculPage},
      {path: 'commission', component: CommissionPage},
      {path: 'transaction', component: TransactionPage},
      {path: 'alltransac', component: AlltransacPage},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostPageRoutingModule {}

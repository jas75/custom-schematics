import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './<%= dasherize(name) %>/<%= dasherize(name) %>.component';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(name) %>Component,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class <%= classify(name) %>RoutingModule {}


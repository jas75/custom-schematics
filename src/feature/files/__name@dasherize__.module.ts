import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { <%= classify(name) %>Component } from './<%= dasherize(name) %>/<%= dasherize(name) %>.component';
import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';

@NgModule({
  declarations: [<%= classify(name) %>Component],
  imports: [CommonModule, SharedModule, <%= classify(name) %>RoutingModule]
})
export class <%= classify(name) %>Module {}

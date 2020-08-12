import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'anms-<%= dasherize(name) %>',
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],
})
export class <%= classify(name) %>Component implements OnInit {

  constructor() {}

  ngOnInit() {}
}

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-<%= classify(name) %>',
  templateUrl: './<%= dasherize(name) %>.modal.html',
  styleUrls: ['./<%= dasherize(name) %>.modal.scss'],
  providers: [NgbActiveModal]
})
export class <%= classify(name) %>Modal {
  
  @Input() name;
  
  constructor(public activeModal: NgbActiveModal) { }
  
  public dismiss(): void {
    this.activeModal.dismiss(false);
  }

}

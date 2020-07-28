import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { <%= classify(name) %>Modal } from './<%= dasherize(name) %>.modal';

describe('<%= classify(name) %>Modal', () => {
  let component: <%= classify(name) %>Modal;
  let fixture: ComponentFixture<<%=classify(name)%>Modal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>Modal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(name) %>Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

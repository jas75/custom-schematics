import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>Business } from './<%= dasherize(name) %>.business';

describe('<%= classify(name) %>Business', () => {
  let service: <%= classify(name) %>Business;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= classify(name) %>Business);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
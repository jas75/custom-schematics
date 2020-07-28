import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>Data } from './<%= dasherize(name) %>.data';

describe('<%= classify(name) %>Data', () => {
  let service: <%= classify(name) %>Data;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= classify(name) %>Data);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
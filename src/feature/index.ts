import { Rule, SchematicsException, url, apply, template, move, chain, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function feature(_options: any): Rule {
  
  if (!_options.name || _options.name <= 0) {
    throw new SchematicsException('You must provide a name');
  }
  const sourceTemplate = url('./files');


  const sourceParametrizedTemplates = apply(sourceTemplate, [
    template({
      ..._options,
      ...strings
    }),
    move(`projects/angular-ngrx-material-starter/src/app/core/data-access/business/${_options.name}/`)
  ]);

  return chain([
    mergeWith(sourceParametrizedTemplates)
  ]);
}

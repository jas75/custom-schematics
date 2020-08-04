import { Rule, SchematicsException, chain, mergeWith, apply, template, move, url } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addDeclarationToNgModule } from '../utils/addDeclaration'




// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function dataBusiness(_options: any): Rule {

  if (!_options.name || _options.name <= 0) {
    throw new SchematicsException('You must provide a name');
  }
  const sourceTemplate = url('./files');

  _options.type = _options.type != null ? _options.type : 'Business';
  _options.module = "projects/angular-ngrx-material-starter/src/app/core/core.module.ts"

  const sourceParametrizedTemplates = apply(sourceTemplate, [
    template({
      ..._options,
      ...strings
    }),
    move(`projects/angular-ngrx-material-starter/src/app/core/data-access/business/${_options.name}/`)
  ]);
    
  return chain([
    addDeclarationToNgModule(_options),
    mergeWith(sourceParametrizedTemplates)
  ]);
}

import { Rule,  apply, template, mergeWith, url, move, SchematicsException, chain } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addDeclarationToNgModule } from '../utils/addDeclaration'



export function createDataService(_options: any): Rule {

  if (!_options.name || _options.name <= 0) {
    throw new SchematicsException('You must provide a name');
  }
  const sourceTemplate = url('./files');

  _options.type = _options.type != null ? _options.type : 'Data';
  _options.module = "projects/angular-ngrx-material-starter/src/app/core/core.module.ts"
  
  const sourceParametrizedTemplates = apply(sourceTemplate, [
    template({
      ..._options,
      ...strings
    }),
    move(`projects/angular-ngrx-material-starter/src/app/core/data-access/data/${_options.name}/`)
  ]);

  return chain([
    addDeclarationToNgModule(_options),
    mergeWith(sourceParametrizedTemplates)
  ])

}

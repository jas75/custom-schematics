import { Rule, Tree, SchematicsException, chain, mergeWith, apply, template, move, url } from '@angular-devkit/schematics';
import ts = require('typescript');
import { strings } from '@angular-devkit/core';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { addProviderToModule, addExportToModule, addEntryComponentToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addDeclarationToNgModule(options: any): Rule {
  return (host: Tree) => {
   
    options.type = options.type != null ? options.type : 'Business';

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);
    
    const componentPath = `${process.cwd()}/src/app/data-access/business/`
                          + (options.flat ? '' : strings.dasherize(options.name) + '/')
                          + strings.dasherize(options.name)
                          + (options.type ? '.' : '')
      + strings.dasherize(options.type);
    const relativePath = buildRelativePath(process.cwd() + '/' + modulePath, componentPath);
    const classifiedName = strings.classify(options.name) + strings.classify(options.type);
    const declarationChanges = addProviderToModule(source,
                                                      modulePath,
                                                      classifiedName,
                                                      relativePath);

    
    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    if (options.export) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source = readIntoSourceFile(host, modulePath);
      const exportRecorder = host.beginUpdate(modulePath);
      const exportChanges = addExportToModule(source, modulePath,
                                              strings.classify(options.name) + strings.classify(options.type),
                                              relativePath);

      for (const change of exportChanges) {
        if (change instanceof InsertChange) {
          exportRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(exportRecorder);
    }

    if (options.entryComponent) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source = readIntoSourceFile(host, modulePath);

      const entryComponentRecorder = host.beginUpdate(modulePath);
      const entryComponentChanges = addEntryComponentToModule(
        source, modulePath,
        strings.classify(options.name) + strings.classify(options.type),
        relativePath);

      for (const change of entryComponentChanges) {
        if (change instanceof InsertChange) {
          entryComponentRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(entryComponentRecorder);
    }

    return host;
  };
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function dataBusiness(_options: any): Rule {

  if (!_options.name || _options.name <= 0) {
    throw new SchematicsException('You must provide a name');
  }
  const sourceTemplate = url('./files');

  const sourceParametrizedTemplates = apply(sourceTemplate, [
    template({
      ..._options,
      ...strings
    }),
    move(`src/app/data-access/business/${_options.name}/`)
  ]);
    
  return chain([
    addDeclarationToNgModule(_options),
    mergeWith(sourceParametrizedTemplates)
  ]);
}

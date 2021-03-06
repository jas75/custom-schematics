import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addProviderToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { InsertChange } from '@schematics/angular/utility/change';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { addEntryComponentToModule } from '@schematics/angular/utility/ast-utils';


function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export function addDeclarationToNgModule(options: any): Rule {
  return (host: Tree) => {
   
    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);
    
    const componentPath = `${process.cwd()}/projects/angular-ngrx-material-starter/src/app/core/data-access/${strings.dasherize(options.type)}/`
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

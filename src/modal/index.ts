import { Rule, SchematicContext, Tree, chain, mergeWith, move, template, SchematicsException, url, apply } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { InsertChange } from '@schematics/angular/utility/change';
import { addEntryComponentToModule, addExportToModule, addDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import ts = require('typescript');

const fs = require('fs');


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
   
    options.type = options.type != null ? options.type : 'Modal';

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);
    
    const componentPath = `${process.cwd()}/src/app/modals/`
                          + (options.flat ? '' : strings.dasherize(options.name) + '/')
                          + strings.dasherize(options.name)
                          + (options.type ? '.' : '')
      + strings.dasherize(options.type);
    const relativePath = buildRelativePath(process.cwd() + '/' + modulePath, componentPath);
    const classifiedName = strings.classify(options.name) + strings.classify(options.type);
    const declarationChanges = addDeclarationToModule(source,
                                                      modulePath,
                                                      classifiedName,
                                                      relativePath);

    console.log('COMPONENT PATH')
    console.log(componentPath);
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
export function modal(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    try {
      fs.statSync(process.cwd() + '/node_modules/@ng-bootstrap');
      
    }
    catch (err) {
        if (err.code === 'ENOENT') {
          console.error('@ng-bootstrap is not installed in your project. Please run ng add @ng-bootstrap/ng-bootstrap.');
          return tree;
        }
    }
    
    if (!_options.name || _options.name <= 0) {
      throw new SchematicsException('You must provide a name');
    }
    const sourceTemplate = url('./files');
  
    const sourceParametrizedTemplates = apply(sourceTemplate, [
      template({
        ..._options,
        ...strings
      }),
      move(`src/app/modals/${_options.name}/`)
    ]);
  
    return chain([
      mergeWith(sourceParametrizedTemplates),
      addDeclarationToNgModule(_options)
    ])

  };
}

// async function test() {
//   return new Promise(() => {
//     rl.question('To use nbgModal, you must install @ng-bootstrap. Would you like to proceed ? Y/n', function(value)  {
//       const answer = value.toLocaleLowerCase();
  
//       switch (answer) {
//         case 'y':
//           console.log('ng-bootstrap setup');
//           break;
//         case 'n':
//           console.log('You must install @ng-bootstrap to create ngbModal, please try again later');
//           break;
//         default:
//           console.log('Yes or no, simple as that, please try again later');
//       }
  
//       rl.close();
//     });
//   })
// }

// async function packageExists(path: string): Promise<boolean> {
//   let exists = fs.stat(path, (err: any) => {
//     if (!err) {
//       console.log('file or directory exists');
//       return true;
//     }
//     else if (err.code === 'ENOENT') {
//       console.log('file or directory does not exist');
//       return false;
//     }
//   });

//   return await exists;
// }

// async function test() {
//   let aie = system('npm ls --json').then(output => {
//     console.log(output);
//   }).catch(error => {
//     console.error(error);
//   });
  
//   await aie;
// }

// function moduleAvailable(name: any) {
//   try {
//       require.resolve(name);
//       return true;
//   } catch (e) {
//     console.log(e);
//   }
//   return false;
// }



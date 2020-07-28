import { Rule, SchematicContext, Tree, chain, url, apply, SchematicsException, template, move, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function setupProxy(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {


    if (!_options.name || _options.name <= 0) {
      throw new SchematicsException('You must provide a target API name');
    }
    const sourceTemplate = url('./files');
  
    const sourceParametrizedTemplates = apply(sourceTemplate, [
      template({
        ..._options,
        ...strings
      }),
      move(`./`)
    ]);

    
    const rule = chain([
      mergeWith(sourceParametrizedTemplates),
      addToJsonFileRule
    ]);
    return rule(tree, _context);
  };
}


function updateJsonFile(host: Tree, path: string, callback: any): Tree {
  const source = host.read(path);
  if (source) {
      const sourceText = source.toString('utf-8');
      const json = JSON.parse(sourceText); // we parse the json
      callback(json); // this will modify the json object
      // we overwrite the file with the new json object
      host.overwrite(path, JSON.stringify(json, null, 2));
  }
  return host;
}
// this is our rule
export function addToJsonFileRule(): Rule {
  return (tree: Tree) => {
      if (!tree.exists(`./package.json`)) { return tree; }
      return updateJsonFile(tree, `./package.json`, (config: any) => {
        config.scripts.start = "ng serve --proxy-config proxy.conf.json";
      });
  };
}


import {
  convertNxGenerator,
  readProjectConfiguration,
  updateProjectConfiguration,
  generateFiles,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import { existsSync } from 'fs';
import { AzureFunctionAppFunctionGeneratorSchema } from './schema';

function updateAzureProjectConfiguration(
  host: Tree,
  options: AzureFunctionAppFunctionGeneratorSchema
) {
  const projectConfiguration = readProjectConfiguration(host, options.projectName);

  if (projectConfiguration.targets == null) {
    projectConfiguration.targets = {};
  }

  projectConfiguration.targets['serve'] = {
    executor: '@nx-azure-function:serve',
    options: {
      buildTarget: 'build',
    },
  };

  if (projectConfiguration.targets['build'] != null) {
    if (projectConfiguration.targets['build'].options != null) {
      if (projectConfiguration.targets['build'].options.assets == null) {
        projectConfiguration.targets['build'].options.assets = [];
      }

      projectConfiguration.targets['build'].options.assets = [
        ...projectConfiguration.targets['build'].options.assets,
        join('apps', options.projectName, 'src', options.functionName, 'function.json'),
      ];

      if (projectConfiguration.targets['build'].options.additionalEntryPoints == null) {
        projectConfiguration.targets['build'].options.additionalEntryPoints = [];
      }

      projectConfiguration.targets['build'].options.additionalEntryPoints = [
        ...projectConfiguration.targets['build'].options.additionalEntryPoints,
        {
          entryName: join(options.functionName, 'index'),
          entryPath: join('apps', options.projectName, 'src', options.functionName, 'index.ts'),
        },
      ];
    }
  }

  updateProjectConfiguration(host, options.projectName, projectConfiguration);
}

export async function azureFunctionGenerator(
  host: Tree,
  options: AzureFunctionAppFunctionGeneratorSchema
) {
  const functionPath = join('apps', options.projectName, 'src', options.functionName);

  if (existsSync(functionPath)) {
    throw new Error(`Azure function ${options.functionName} exists already`);
  }

  updateAzureProjectConfiguration(host, options);
  generateFiles(host, join(__dirname, 'files'), functionPath, {});
}

export default azureFunctionGenerator;
export const azureFunctionSchematic = convertNxGenerator(azureFunctionGenerator);

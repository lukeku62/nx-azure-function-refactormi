import {
  convertNxGenerator,
  addDependenciesToPackageJson,
  readProjectConfiguration,
  updateProjectConfiguration,
  generateFiles,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import { AzureFunctionAppInitGeneratorSchema } from './schema';
import { AZURE_FUNCTIONS_CORE_TOOLS_VERSION, AZURE_FUNCTIONS_VERSION } from '../../versions';

function updateAzureProjectConfiguration(host: Tree, options: AzureFunctionAppInitGeneratorSchema) {
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
      projectConfiguration.targets['build'].options.generatePackageJson = true;

      if (projectConfiguration.targets['build'].options.assets == null) {
        projectConfiguration.targets['build'].options.assets = [];
      }

      projectConfiguration.targets['build'].options.assets = [
        ...projectConfiguration.targets['build'].options.assets,
        join('apps', options.projectName, 'src', '.funcignore'),
        join('apps', options.projectName, 'src', 'local.settings.json'),
        join('apps', options.projectName, 'src', 'host.json'),
      ];

      projectConfiguration.targets['build'].options.assets = projectConfiguration.targets[
        'build'
      ].options.assets.filter(
        // @ts-ignore
        (asset, i) => projectConfiguration.targets['build'].options.assets.indexOf(asset) === i
      );
    }
  }

  updateProjectConfiguration(host, options.projectName, projectConfiguration);
}

export async function azureFunctionInitGenerator(
  host: Tree,
  options: AzureFunctionAppInitGeneratorSchema
) {
  const installTask = addDependenciesToPackageJson(
    host,
    {
      '@azure/functions': AZURE_FUNCTIONS_VERSION,
    },
    {
      'azure-functions-core-tools': AZURE_FUNCTIONS_CORE_TOOLS_VERSION,
    }
  );

  updateAzureProjectConfiguration(host, options);
  generateFiles(host, join(__dirname, 'files'), join('apps', options.projectName, 'src'), {});

  return installTask;
}

export default azureFunctionInitGenerator;
export const azureFunctionInitSchematic = convertNxGenerator(azureFunctionInitGenerator);

import { ExecutorContext, runExecutor } from '@nx/devkit';
import { spawn, ChildProcess } from 'child_process';
import { dirname } from 'path';

type Options = {
  buildTarget: string;
};

export default async function serveExecutor(options: Options, context: ExecutorContext) {
  const { buildTarget } = options;

  if (context.projectName == null) {
    throw new Error('"projectName" is missing');
  }

  const watchIterator = await runExecutor(
    {
      project: context.projectName,
      target: buildTarget,
      configuration: context.configurationName,
    },
    { watch: true },
    context
  );

  let functionProcess: ChildProcess | null = null;

  for await (const result of watchIterator) {
    if (result.success && functionProcess == null) {
      functionProcess = spawn('npx', ['func', 'start'], {
        stdio: 'inherit',
        // @ts-ignore
        cwd: dirname(result.outfile),
      });

      functionProcess.on('exit', () => {
        process.exit(1);
      });
    }
  }

  if (functionProcess != null) {
    functionProcess.kill();
  }

  return { success: true };
}

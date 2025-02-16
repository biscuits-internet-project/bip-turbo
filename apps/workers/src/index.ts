import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  const connection = await NativeConnection.connect({
    address: 'localhost:7235'
  });

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'my-app-queue',
    connection,
    namespace: 'default',
  });

  console.log('Worker connected, listening for tasks on queue: my-app-queue');
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
}); 
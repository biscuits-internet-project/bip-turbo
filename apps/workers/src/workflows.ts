import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { exampleActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function exampleWorkflow(name: string): Promise<string> {
  return await exampleActivity(name);
} 
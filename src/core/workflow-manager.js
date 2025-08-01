// src/core/workflow-manager.js
import chalk from 'chalk';

export class WorkflowManager {
    constructor(llmManager, agentManager) {
        this.llmManager = llmManager;
        this.agentManager = agentManager;
    }

    createWorkflow(workflowDefinition) {
        const self = this; // Capture 'this' for use in inner functions
        return {
            definition: workflowDefinition,
            async execute(initialInput) {
                console.log(chalk.magenta(`🚀 Starting workflow with initial input: "${initialInput}"`));
                const results = {};
                const taskQueue = [...workflowDefinition]; // Copy to allow modification

                while (taskQueue.length > 0) {
                    const currentTask = taskQueue.shift();
                    const { agent: agentName, task: taskName, depends } = currentTask;

                    let allDependenciesMet = true;
                    let dependencyResults = {};
                    if (depends && depends.length > 0) {
                        for (const dep of depends) {
                            if (!results[dep]) {
                                allDependenciesMet = false;
                                break;
                            }
                            dependencyResults[dep] = results[dep];
                        }
                    }

                    if (!allDependenciesMet) {
                        taskQueue.push(currentTask);
                        continue;
                    }

                    console.log(chalk.cyan(`  Executing task "${taskName}" by agent "${agentName}"...`));
                    let inputForAgent = initialInput;
                    if (depends && depends.length > 0) {
                        inputForAgent = `${initialInput}\n\nPrevious results: ${JSON.stringify(dependencyResults)}`;
                    }

                    try {
                        const agentResult = await self.agentManager.runAgent(agentName, inputForAgent);
                        results[taskName] = agentResult.response;
                        console.log(chalk.green(`  ✅ Task "${taskName}" completed. Result stored.`));
                    } catch (error) {
                        console.error(chalk.red(`  ❌ Task "${taskName}" failed for agent "${agentName}": ${error.message}`));
                        results[taskName] = `Error: ${error.message}`;
                        throw new Error(`Workflow failed at task "${taskName}": ${error.message}`);
                    }
                }
                console.log(chalk.magenta('🎉 Workflow completed!'));
                return results;
            }
        };
    }

    async parallel(tasks) {
        console.log(chalk.blue(`⚡ Executing ${tasks.length} tasks in parallel...`));
        const promises = tasks.map(task => {
            if (task instanceof Promise) {
                return task;
            } else if (task.agent && task.input) {
                return this.agentManager.runAgent(task.agent, task.input, task.options);
            } else if (task.prompt) {
                return this.llmManager.chat(task.prompt, task.options);
            }
            return Promise.reject(new Error('Invalid task format for parallel execution.'));
        });

        try {
            const results = await Promise.all(promises);
            console.log(chalk.green('✅ All parallel tasks completed.'));
            return results;
        } catch (error) {
            console.error(chalk.red(`❌ One or more parallel tasks failed: ${error.message}`));
            throw error;
        }
    }

    async batch(promptsAndOptions) {
        console.log(chalk.blue(`📦 Processing ${promptsAndOptions.length} prompts in batch...`));
        const promises = promptsAndOptions.map(item => {
            if (!item.prompt) {
                return Promise.reject(new Error('Each batch item must have a "prompt" property.'));
            }
            return this.llmManager.chat(item.prompt, item.options);
        });

        try {
            const results = await Promise.all(promises);
            console.log(chalk.green('✅ All batch prompts processed.'));
            return results;
        } catch (error) {
            console.error(chalk.red(`❌ One or more batch prompts failed: ${error.message}`));
            throw error;
        }
    }
}
// src/tools/scheduler-tool.js - Task Scheduling Tool
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

class SchedulerTool {
  constructor() {
    this.name = 'scheduler';
    this.description = 'Schedule and manage recurring tasks and jobs';
    this.scheduledTasks = new Map();
    this.tasksFile = './memory/scheduled_tasks.json';
    this.loadTasks();

    this.parameters = {
      action: {
        type: 'string',
        description: 'Action to perform: schedule, list, cancel, start, stop',
        required: true,
      },
      taskId: {
        type: 'string',
        description: 'Task ID (required for cancel, start, stop actions)',
      },
      cronPattern: {
        type: 'string',
        description:
          'Cron pattern for scheduling (e.g., "0 9 * * *" for daily at 9 AM)',
      },
      taskName: {
        type: 'string',
        description: 'Human readable task name',
      },
      taskFunction: {
        type: 'string',
        description: 'Function to execute (callback name or description)',
      },
      timezone: {
        type: 'string',
        description: 'Timezone for the task (e.g., "America/New_York")',
        default: 'UTC',
      },
      immediate: {
        type: 'boolean',
        description: 'Execute task immediately after scheduling',
        default: false,
      },
    };
  }

  async execute(params) {
    const { action } = params;

    switch (action.toLowerCase()) {
      case 'schedule':
        return await this.scheduleTask(params);
      case 'list':
        return this.listTasks();
      case 'cancel':
        return this.cancelTask(params.taskId);
      case 'start':
        return this.startTask(params.taskId);
      case 'stop':
        return this.stopTask(params.taskId);
      default:
        throw new Error(
          `Unknown action: ${action}. Available actions: schedule, list, cancel, start, stop`
        );
    }
  }

  async scheduleTask(params) {
    const {
      cronPattern,
      taskName,
      taskFunction,
      timezone = 'UTC',
      immediate = false,
    } = params;

    if (!cronPattern) {
      throw new Error('Cron pattern is required for scheduling tasks');
    }

    if (!taskName) {
      throw new Error('Task name is required');
    }

    // Validate cron pattern
    if (!cron.validate(cronPattern)) {
      throw new Error(`Invalid cron pattern: ${cronPattern}`);
    }

    const taskId = uuidv4();
    const task = {
      id: taskId,
      name: taskName,
      cronPattern,
      function: taskFunction || 'default',
      timezone,
      created: new Date().toISOString(),
      lastRun: null,
      nextRun: null,
      runCount: 0,
      isActive: false,
      status: 'scheduled',
    };

    try {
      // Create the scheduled task
      const scheduledTask = cron.schedule(
        cronPattern,
        () => {
          this.executeScheduledTask(taskId);
        },
        {
          scheduled: false, // Don't start immediately
          timezone: timezone,
        }
      );

      task.cronJob = scheduledTask;
      task.nextRun = this.getNextRun(cronPattern, timezone);

      // Start the task
      scheduledTask.start();
      task.isActive = true;
      task.status = 'active';

      this.scheduledTasks.set(taskId, task);
      this.saveTasks();

      // Execute immediately if requested
      if (immediate) {
        await this.executeScheduledTask(taskId);
      }

      console.log(
        `✅ Task "${taskName}" scheduled successfully with ID: ${taskId}`
      );

      return {
        success: true,
        taskId,
        taskName,
        cronPattern,
        nextRun: task.nextRun,
        message: `Task scheduled successfully. Next run: ${task.nextRun}`,
      };
    } catch (error) {
      throw new Error(`Failed to schedule task: ${error.message}`);
    }
  }

  listTasks() {
    const tasks = Array.from(this.scheduledTasks.values()).map((task) => ({
      id: task.id,
      name: task.name,
      cronPattern: task.cronPattern,
      timezone: task.timezone,
      status: task.status,
      isActive: task.isActive,
      created: task.created,
      lastRun: task.lastRun,
      nextRun: task.nextRun,
      runCount: task.runCount,
    }));

    return {
      totalTasks: tasks.length,
      activeTasks: tasks.filter((t) => t.isActive).length,
      tasks,
    };
  }

  cancelTask(taskId) {
    if (!taskId) {
      throw new Error('Task ID is required for cancellation');
    }

    const task = this.scheduledTasks.get(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    try {
      if (task.cronJob) {
        task.cronJob.destroy();
      }

      this.scheduledTasks.delete(taskId);
      this.saveTasks();

      console.log(`✅ Task "${task.name}" (${taskId}) cancelled successfully`);

      return {
        success: true,
        taskId,
        taskName: task.name,
        message: `Task "${task.name}" cancelled successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to cancel task: ${error.message}`);
    }
  }

  startTask(taskId) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    const task = this.scheduledTasks.get(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    if (task.isActive) {
      return {
        success: false,
        message: `Task "${task.name}" is already active`,
      };
    }

    try {
      if (task.cronJob) {
        task.cronJob.start();
        task.isActive = true;
        task.status = 'active';
        task.nextRun = this.getNextRun(task.cronPattern, task.timezone);
        this.saveTasks();
      }

      console.log(`✅ Task "${task.name}" started successfully`);

      return {
        success: true,
        taskId,
        taskName: task.name,
        nextRun: task.nextRun,
        message: `Task "${task.name}" started successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to start task: ${error.message}`);
    }
  }

  stopTask(taskId) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    const task = this.scheduledTasks.get(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    if (!task.isActive) {
      return {
        success: false,
        message: `Task "${task.name}" is already stopped`,
      };
    }

    try {
      if (task.cronJob) {
        task.cronJob.stop();
        task.isActive = false;
        task.status = 'stopped';
        task.nextRun = null;
        this.saveTasks();
      }

      console.log(`✅ Task "${task.name}" stopped successfully`);

      return {
        success: true,
        taskId,
        taskName: task.name,
        message: `Task "${task.name}" stopped successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to stop task: ${error.message}`);
    }
  }

  async executeScheduledTask(taskId) {
    const task = this.scheduledTasks.get(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found during execution`);
      return;
    }

    try {
      console.log(`🔄 Executing scheduled task: ${task.name} (${taskId})`);

      task.lastRun = new Date().toISOString();
      task.runCount += 1;
      task.nextRun = this.getNextRun(task.cronPattern, task.timezone);

      // Here you would execute the actual task function
      // For now, we'll just log the execution
      console.log(`Task "${task.name}" executed successfully`);

      // Save the updated task info
      this.saveTasks();

      return {
        success: true,
        taskId,
        taskName: task.name,
        executedAt: task.lastRun,
        runCount: task.runCount,
      };
    } catch (error) {
      console.error(`❌ Failed to execute task "${task.name}":`, error);
      task.lastError = error.message;
      task.lastErrorTime = new Date().toISOString();
      this.saveTasks();
    }
  }

  getNextRun(cronPattern, timezone = 'UTC') {
    try {
      // This is a simplified next run calculation
      // In a real implementation, you'd use a proper cron parser
      const task = cron.schedule(cronPattern, () => {}, {
        scheduled: false,
        timezone,
      });

      // For now, return a placeholder
      return new Date(Date.now() + 60000).toISOString(); // Next minute as placeholder
    } catch (error) {
      return null;
    }
  }

  loadTasks() {
    try {
      if (fs.existsSync(this.tasksFile)) {
        const data = fs.readFileSync(this.tasksFile, 'utf8');
        const tasks = JSON.parse(data);

        // Restore scheduled tasks (without the actual cron jobs)
        tasks.forEach((task) => {
          // Don't restore the cronJob, just the data
          delete task.cronJob;
          task.status = 'stopped'; // All tasks start as stopped after restart
          task.isActive = false;
          this.scheduledTasks.set(task.id, task);
        });

        console.log(`📅 Loaded ${tasks.length} scheduled tasks from storage`);
      }
    } catch (error) {
      console.warn(`Could not load scheduled tasks: ${error.message}`);
    }
  }

  saveTasks() {
    try {
      const memoryDir = path.dirname(this.tasksFile);
      if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
      }

      const tasks = Array.from(this.scheduledTasks.values()).map((task) => {
        // Don't save the cronJob object, just the data
        const { cronJob, ...taskData } = task;
        return taskData;
      });

      fs.writeFileSync(this.tasksFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error(`Failed to save scheduled tasks: ${error.message}`);
    }
  }

  // Utility method to get common cron patterns
  static getCommonPatterns() {
    return {
      'every-minute': '* * * * *',
      'every-5-minutes': '*/5 * * * *',
      'every-hour': '0 * * * *',
      'daily-9am': '0 9 * * *',
      'daily-midnight': '0 0 * * *',
      'weekly-monday-9am': '0 9 * * 1',
      'monthly-1st-9am': '0 9 1 * *',
      'yearly-jan-1st': '0 0 1 1 *',
      'workdays-9am': '0 9 * * 1-5',
      'weekend-10am': '0 10 * * 6,0',
    };
  }

  getInfo() {
    return {
      name: this.name,
      description: this.description,
      activeTasks: Array.from(this.scheduledTasks.values()).filter(
        (t) => t.isActive
      ).length,
      totalTasks: this.scheduledTasks.size,
      commonPatterns: SchedulerTool.getCommonPatterns(),
    };
  }
}

export default SchedulerTool;

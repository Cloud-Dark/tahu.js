// src/core/plugin-manager.js
import fs from 'fs';
import chalk from 'chalk';

export class PluginManager {
  constructor(tahuInstance) {
    this.tahuInstance = tahuInstance; // Reference to the main TahuJS instance
  }

  use(plugin) {
    if (typeof plugin === 'function') {
      plugin(this.tahuInstance); // Pass the TahuJS instance to the plugin function
    } else {
      console.warn('⚠️  Warning: Plugin must be a function.');
    }
  }

  loadPlugins(directory) {
    if (!fs.existsSync(directory)) {
      console.warn(
        chalk.yellow(`⚠️  Warning: Plugin directory "${directory}" not found.`)
      );
      return;
    }
    const files = fs.readdirSync(directory);
    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          import(`${directory}/${file}`)
            .then((module) => {
              if (typeof module.default === 'function') {
                this.use(module.default);
              } else {
                console.warn(
                  chalk.yellow(
                    `⚠️  Warning: Plugin file "${file}" does not export a default function.`
                  )
                );
              }
            })
            .catch((error) => {
              console.error(
                chalk.red(`❌ Error loading plugin "${file}": ${error.message}`)
              );
            });
        } catch (error) {
          console.error(
            chalk.red(`❌ Error loading plugin "${file}": ${error.message}`)
          );
        }
      }
    }
  }
}

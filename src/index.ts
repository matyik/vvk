#!/usr/bin/env node

// remove warnings in console
process.removeAllListeners('warning');

import { exec } from 'child_process';
import readline from 'readline';
import { generateCommand } from './generate-command';
import { loadConfig } from './config';
import { configCommand } from './config-command';
import { login, logout } from './login';

const config = loadConfig();

// Get command from CLI arguments
const args = process.argv.slice(2);
const userInput = args.join(' ');

if (args[0] === 'config') {
  configCommand(args);
} else if (args[0] === 'help' && args.length === 1) {
  console.log(`
    Available commands:
      vvk <command>      : Generate and execute a command
      vvk config set ... : Set configuration options
      vvk login          : Log in to your account
      vvk logout         : Log out of your account
      vvk --version      : Show version
  `);
  process.exit(0);
} else if ((args[0] === '--version' || args[0] === '-v') && args.length === 1) {
  console.log('1.1.1');
} else if (args[0] === 'login' && args.length === 1) {
  login();
} else if (args[0] === 'logout' && args.length === 1) {
  logout();
} else {
  if (!userInput) {
    console.log('Usage: vvk <your natural language command>');
    process.exit(1);
  }

  processCommand(userInput);
}

// Function to prompt for confirmation
function confirmExecution(command: string) {
  // If confirmation is disabled, use the default confirmation setting
  if (!config.confirmCommand) {
    if (config.defaultConfirmation.toLowerCase() === 'y') {
      executeCommand(command);
    } else {
      console.log('Command execution canceled based on configuration.');
      process.exit(0);
    }
    return;
  }

  // Otherwise, prompt the user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Build the prompt with a default hint (Y/n or y/N)
  const promptDefault = config.defaultConfirmation.toLowerCase() === 'y' ? 'Y/n' : 'y/N';

  rl.question(`\nRun this command? [${promptDefault}]: ${command} `, (answer) => {
    rl.close();
    const normalized = answer.trim().toLowerCase();
    // If the user presses enter, use the default option
    if (normalized === '') {
      if (config.defaultConfirmation.toLowerCase() === 'y') {
        executeCommand(command);
      } else {
        console.log('Command execution canceled based on default configuration.');
        process.exit(0);
      }
    } else if (normalized === 'y') {
      executeCommand(command);
    } else {
      console.log('Command execution canceled.');
      process.exit(0);
    }
  });
}

// Function to execute command
function executeCommand(command: string) {
  console.log(`\nExecuting: ${command}\n`);
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);
  });
}

// Function to process input using AI
async function processCommand(input: string) {
  console.log(`Thinking...`);

  const command = await generateCommand(input);

  confirmExecution(command);
}

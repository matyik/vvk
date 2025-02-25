#!/usr/bin/env node

import { config } from 'dotenv';
import { exec } from 'child_process';
import OpenAI from 'openai';
import readline from 'readline';

// Load environment variables from .env
config();

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: Missing OpenAI API key. Set OPENAI_API_KEY in .env');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Get command from CLI arguments
const userInput = process.argv.slice(2).join(' ');

if (!userInput) {
  console.log('Usage: ai-cli <your natural language command>');
  process.exit(1);
}

// Function to prompt for confirmation
function confirmExecution(command: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`\nRun this command? [y/N]: ${command} `, (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y') {
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

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: "Convert the user's request into a shell command without explanation.",
      },
      { role: 'user', content: input },
    ],
  });

  const command = response.choices[0]?.message?.content?.trim();

  if (!command) {
    console.log("Couldn't generate a command.");
    process.exit(1);
  }

  confirmExecution(command);
}

processCommand(userInput);

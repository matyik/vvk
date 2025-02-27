import OpenAI from 'openai';
import { config } from 'dotenv';
import { loadConfig } from './config';

config();

export async function generateCommand(input: string) {
  const { openaiApiKey } = loadConfig();

  if (!openaiApiKey) {
    console.log("Couldn't generage command: Set your OpenAI API Key with vvk config set openaiApiKey <your_api_key>");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

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

  return command;
}

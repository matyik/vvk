import OpenAI from 'openai';
import { loadConfig } from './config';
import axios from 'axios';

export async function generateCommand(input: string) {
  const { openaiApiKey, key, userId, useOllama, ollamaHost, ollamaModel } = loadConfig();

  let command;

  if (useOllama) {
    try {
      const response = await axios.post(`${ollamaHost}/api/generate`, {
        model: ollamaModel,
        prompt: `Convert the following request into a shell command without explanation. Give only the command on a single line, no other text. Do not format in any way. If the request requires multiple commands, return them in the same line separated by the && operator. If you cannot generate a command, return only the string 'VVKERROR' and nothing else.\n\nRequest: ${input}`,
        stream: false,
      });

      command = response.data.response.trim();
    } catch (err) {
      if (err instanceof Error) {
        console.error('❌ Error connecting to Ollama:', err.message);
      } else {
        console.error('❌ Error connecting to Ollama:', String(err));
      }
      console.error('Make sure Ollama is running and accessible at', ollamaHost);
      process.exit(1);
    }
  } else if (openaiApiKey && openaiApiKey.length > 1) {
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            "Convert the user's request into a shell command without explanation. Give only the command on a single line, no other text. Do not format in any way. If the user's request requires multiple commands, return them in the same line separated by the && operator. If you cannot generate a command, return only the string 'VVKERROR' and nothing else.",
        },
        { role: 'user', content: input },
      ],
    });

    command = response.choices[0]?.message?.content?.trim();
  } else if (key?.length > 1 && userId?.length > 1) {
    let response;
    try {
      response = await axios.post('https://vvk.ai/api/command', {
        input,
        key,
        userId,
      });

      command = await response?.data?.command;
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        // 401 error
        console.error('❌ Error authenticating. Try running vvk login again.');
      }
      process.exit(1);
    }
  } else {
    console.error(
      "Couldn't generate command: Set your OpenAI API Key with vvk config set openaiApiKey <your_api_key>, log in with vvk login, or enable Ollama with vvk config set useOllama true"
    );
    process.exit(1);
  }
  if (!command || command === 'VVKERROR') {
    console.error("Couldn't generate a command.");
    process.exit(1);
  }

  return command;
}

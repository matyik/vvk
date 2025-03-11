import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

export interface Config {
  openaiApiKey: string;
  userId: string;
  key: string;
  confirmCommand: boolean;
  defaultConfirmation: 'y' | 'n';
  useOllama: boolean;
  ollamaHost: string;
  ollamaModel: string;
}

const DEFAULT_CONFIG: Config = {
  openaiApiKey: '',
  userId: '',
  key: '',
  confirmCommand: true,
  defaultConfirmation: 'y',
  useOllama: false,
  ollamaHost: 'http://localhost:11434',
  ollamaModel: 'llama3.1:latest',
};

const CONFIG_FILE_PATH = path.join(os.homedir(), '.vvk-config.json');

export function loadConfig(): Config {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    try {
      const rawData = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      const existingConfig = JSON.parse(rawData);

      // Ensure all default config properties exist in the loaded config
      const mergedConfig = { ...DEFAULT_CONFIG, ...existingConfig };

      // If the config file is missing any of the new Ollama fields, update it
      if (!('useOllama' in existingConfig) || !('ollamaHost' in existingConfig) || !('ollamaModel' in existingConfig)) {
        saveConfig(mergedConfig);
      }

      return mergedConfig;
    } catch (error) {
      console.error('Error parsing config, reverting to defaults.', error);
      saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
  } else {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: Config): void {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save configuration.', error);
  }
}

export function updateConfig(updates: Partial<Config>): Config {
  const currentConfig = loadConfig();
  const newConfig = { ...currentConfig, ...updates };
  saveConfig(newConfig);
  return newConfig;
}

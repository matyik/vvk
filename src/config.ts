import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

export interface Config {
  openaiApiKey: string;
  userId: string;
  key: string;
  confirmCommand: boolean;
  defaultConfirmation: 'y' | 'n';
}

const DEFAULT_CONFIG: Config = {
  openaiApiKey: '',
  userId: '',
  key: '',
  confirmCommand: true,
  defaultConfirmation: 'y',
};

const CONFIG_FILE_PATH = path.join(os.homedir(), '.vvk-config.json');

export function loadConfig(): Config {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    try {
      const rawData = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(rawData) };
    } catch (error) {
      console.error('Error parsing config, reverting to defaults.', error);
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

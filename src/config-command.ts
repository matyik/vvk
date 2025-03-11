import { Config, updateConfig, loadConfig } from './config';

export function configCommand(args: string[]) {
  const command = args[1];

  if (command === 'set') {
    const key = args[2] as keyof Config;
    const value = args.slice(3).join(' ');
    if (!key || !value) {
      console.error('Usage: vvk config set <key> <value>');
      process.exit(1);
    }
    // For boolean fields, parse the value
    let parsedValue: string | boolean = value;
    if (key === 'confirmCommand' || key === 'useOllama') {
      parsedValue = value.toLowerCase() === 'true' || value.toLowerCase() === 'y';
    }
    const updated = updateConfig({ [key]: parsedValue });
    if (updated.key && updated.key.length > 0) {
      updated.key = '********';
    }
    console.log('Configuration updated:', updated);
  } else if (command === 'get' || command === 'list') {
    const config = loadConfig();
    if (config.key && config.key.length > 0) {
      config.key = '********';
    }
    console.log('Current configuration:', config);
  } else if (command === 'remove' || command === 'rm') {
    // set key to an empty string
    const key = args[2] as keyof Config;
    if (
      key === 'confirmCommand' ||
      key === 'defaultConfirmation' ||
      key === 'useOllama' ||
      key === 'ollamaHost' ||
      key === 'ollamaModel'
    ) {
      console.error(`Cannot remove ${key}`);
      process.exit(1);
    }

    const updated = updateConfig({ [key]: '' });
    if (updated.key && updated.key.length > 0) {
      updated.key = '********';
    }
    console.log('Configuration updated:', updated);
  } else {
    console.error('Unknown config command. Use "set", "remove", or "list".');
  }
  process.exit(0);
}

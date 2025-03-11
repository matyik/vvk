# **vvk**

A command-line interface tool that converts natural language instructions into shell commands using OpenAI's GPT-4.

## **Prerequisites**

Before using this tool, you need to configure your API key and preferences.
Get an OpenAI API key at https://platform.openai.com/api-keys
Alternatively, sign up for VVK Cloud at https://vvk.ai/

## Installation

### Prerequisites

- Node.js 18+  
  Verify with:
  ```bash
  node --version
  ```

### Install as a Global CLI Tool

```bash
# Using npm
npm install -g vvk

# Using pnpm
pnpm add -g vvk

# Using yarn
yarn global add vvk
```

### Verify Installation

```bash
vvk --version
```

### Update

```bash
npm update -g vvk
# or
pnpm update -g vvk
```

### Uninstall

```bash
npm uninstall -g vvk
# or
pnpm remove -g vvk
```

### Troubleshooting

- **Permission Errors**: Use `sudo` (not recommended) or fix npm permissions:
  ```bash
  # Reset npm permissions
  npm config set prefix ~/.npm-global
  echo 'export PATH="$PATH:$HOME/.npm-global/bin"' >> ~/.bashrc
  source ~/.bashrc
  ```

## **Setup Configuration**

Use the `vvk config set` command to configure your settings:

```bash
# If using your own Openai API key, set it in the config
vvk config set openaiApiKey your_api_key_here

# Enable or disable command confirmation (default: true)
vvk config set confirmCommand true

# Set default confirmation behavior (y/n)
vvk config set defaultConfirmation y
```

You can check your current settings with:

```bash
vvk config list
```

## **Login**

If using VVK Cloud, use the `vvk login` command to log in through the browser

```bash
# Sets the key and userId values
vvk login
```

You can log out with:

```bash
vvk logout
```

## **Usage**

Run commands using natural language:

```bash
vvk <your natural language command>
```

### **Examples**

```bash
# List all files in the current directory
vvk show me all files in this folder

# Find large files
vvk find files larger than 100MB

# Search for text in files
vvk search for "hello world" in all javascript files
```

The tool will:

1. Process your natural language input
2. Generate an appropriate shell command
3. Show you the command for confirmation (if enabled)
4. Execute the command upon your approval

## **Development**

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/matyik/vvk.git

# Install dependencies
pnpm install

# Build the project
pnpm build

# Create a global link
pnpm link --global

# Now you can use the development version globally
vvk <command>
```

## **License**

MIT License - see LICENSE file for details

## **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

## **Using with Ollama**

VVK can use [Ollama](https://ollama.ai/) as an alternative to OpenAI's API for generating commands.

### Setup Ollama

1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Start the Ollama service
3. Pull your preferred model:
   ```bash
   ollama pull llama3
   ```

### Configure VVK to use Ollama

```bash
# Enable Ollama
vvk config set useOllama true

# Set Ollama host (default is http://localhost:11434)
vvk config set ollamaHost http://localhost:11434

# Set Ollama model (default is llama3)
vvk config set ollamaModel llama3
```

When Ollama is enabled, VVK will use it instead of OpenAI or VVK Cloud for generating commands.

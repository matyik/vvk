# zzk

A command-line interface tool that converts natural language instructions into shell commands using OpenAI's GPT-4.

## Prerequisites

Before using this tool, you need to:

1. Have an OpenAI API key
2. Create a `.env` file in your project root with:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Usage

```bash
zzk <your natural language command>
```

### Examples

```bash
# List all files in the current directory
zzk show me all files in this folder

# Find large files
zzk find files larger than 100MB

# Search for text in files
zzk search for "hello world" in all javascript files
```

The tool will:

1. Process your natural language input
2. Generate an appropriate shell command
3. Show you the command for confirmation
4. Execute the command upon your approval

## Development

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/matyik/zzk.git

# Install dependencies
pnpm install

# Build the project
pnpm build

# Create a global link
pnpm link --global

# Now you can use the development version globally
zzk <command>
```

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

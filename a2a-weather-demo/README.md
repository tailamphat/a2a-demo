# A2A Multi-Agent Weather Demo

This project is a command-line interface (CLI) application that demonstrates a multi-agent system for fetching and displaying weather information. It utilizes the Google ADK (Agent Development Kit) and features a root agent that can delegate tasks to other agents.

## Features

- Interactive CLI for weather queries.
- Demonstrates multi-agent workflow.
- Uses session-scoped memory to remember the last queried city.
- Includes a tool guard to block weather queries for specific cities.

## Project Structure

```
.
├── agents/          # Contains agent definitions (e.g., root_agent)
├── tools/           # Contains tool definitions used by agents
├── chat_cli.py      # Main CLI application
├── callbacks.py     # Defines callback functions, e.g., tool guards
├── memory.py        # Simple session-scoped memory implementation
├── main.py          # Checks for GOOGLE_API_KEY
├── requirements.txt # Project dependencies
└── README.md        # This file
```

## Getting Started

### Prerequisites

- Python 3.x
- Access to Google Cloud and a `GOOGLE_API_KEY`

### Installation & Setup

1.  **Clone the repository (if applicable):**

    ```bash
    # git clone <repository_url>
    # cd <repository_directory>
    ```

2.  **Create and activate a Python virtual environment:**
    It is highly recommended to use a virtual environment to manage project dependencies.

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate  # On Windows use ` .\venv\Scripts\activate `
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

    The `requirements.txt` file should ideally contain:

    ```
    google-adk  # Or specific version e.g., google-adk==0.5.1
    litellm
    python-dotenv
    rich
    prompt_toolkit
    ```

4.  **Set up your environment variables:**
    Create a `.env` file in the root of the project directory and add your Google API key:
    ```env
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
    ```
    The `main.py` script will check for this key upon execution.

## Usage

To run the interactive CLI:

```bash
python chat_cli.py
```

Or, if you have multiple Python versions:

```bash
python3 chat_cli.py
```

You can then type your weather-related queries into the prompt. Type `exit` or press `Ctrl-D` to quit.

## Key Components

- **`chat_cli.py`**: The main entry point for the interactive command-line application. It handles user input, interacts with the ADK runner, and displays responses, including tool calls and agent messages.
- **`agents/root_agent.py`** (assumed location): Defines the primary agent that orchestrates the conversation and tool usage.
- **`memory.py`**: Provides a simple mechanism to store and retrieve the last city queried within a session. This uses the `SessionService` extras dictionary.
- **`callbacks.py`**: Implements guard functions for tools. For example, `weather_tool_guard` prevents fetching weather for a predefined list of blocked cities.
- **`main.py`**: Primarily responsible for checking the presence of the `GOOGLE_API_KEY` environment variable before the application fully starts.
- **`tools/`** (assumed location): This directory would typically contain the definitions for tools that agents can use, such as a `get_weather` tool.

## How it Works

1.  The user launches `chat_cli.py`.
2.  `main.py` (implicitly or explicitly called) verifies the `GOOGLE_API_KEY`.
3.  The CLI prompts the user for input.
4.  User input is sent to the `root_agent` via the ADK `Runner`.
5.  The `root_agent` processes the input. It might:
    - Respond directly.
    - Call a tool (e.g., to get weather information).
    - Delegate to another agent.
6.  If a tool is called (e.g., `get_weather`), `callbacks.py` might intercept the call with `weather_tool_guard` to check for restricted cities.
7.  The `memory.py` module can be used by agents to save and load session-specific data, like the `last_city`.
8.  Responses, including text from agents and information about tool calls, are streamed back to the user in the CLI.

## Audience

This README is intended for developers who want to understand, run, or contribute to this project.

# Python Analysis Tools for Visual Studio Code

This Visual Studio Code extension provides a comprehensive suite of tools for analyzing and enhancing the quality of Python code. It integrates several powerful tools to lint, format, and analyze the code quality, including checking for cyclomatic complexity, maintainability index, and raw metrics.

## Key Features

- **Linting with flake8**: Identify and report on stylistic and logical issues in your Python code.
- **Autoformatting with black**: Automatically format your Python code to conform to the PEP 8 style guide.
- **Import sorting with isort**: Sort and organize your Python imports automatically.
- **Code Quality Analysis with radon**: Analyze your Python code for cyclomatic complexity, maintainability index, and raw metrics.

## Requirements

To use this extension, you must have the following tools installed:

- `flake8` for linting.
- `black` for formatting.
- `isort` for import sorting.
- `radon` for code quality analysis.

You can install these tools using pip:

```bash
pip install flake8 black isort radon
```

Ensure that these tools are available in your system's PATH or in the Python environment you're using with VS Code so that the extension can call them.

## How to Use
1.You can configure the extension to run the full analysis automatically whenever you save a Python file.

2.The extension provides a set of commands accessible through the Visual Studio Code Command Palette:

- **Lint Current File**: Run `flake8` to lint the currently open Python file.
- **Format Current File**: Use `black` to format the currently open Python file.
- **Sort Imports**: Apply `isort` to sort the imports in the currently open Python file.
- **Analyze Code Quality**: Perform code quality analysis on the current file using `radon`.

To trigger the full analysis workflow, which includes linting, formatting, import sorting, and code quality analysis, you can use the following command:

- **Start Full Analysis Workflow**: This command runs all the analysis tools in sequence on the active Python file.


## Getting Started

1. Install the Python Analysis Tools extension from the Visual Studio Code and run.
2. Open a Python file in Visual Studio Code and just save the file to activate the extension.
3. Also can access the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run the desired commands to lint, format, and analyze your code.



Enjoy a seamless Python coding experience with enhanced readability and maintainability!
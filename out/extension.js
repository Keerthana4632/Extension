"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const outputChannel = vscode.window.createOutputChannel("Python Tools");
function lintPythonFile(filePath) {
    console.log("Starting linting...");
    return new Promise((resolve, reject) => {
        outputChannel.appendLine(`Analysis for Python file: ${filePath}`);
        outputChannel.appendLine(`===============================================`);
        let lintResults = { "Issues": [] };
        const flake8Process = (0, child_process_1.spawn)('flake8', [filePath], { shell: true });
        let lintData = '';
        flake8Process.stdout.on('data', (data) => {
            lintData += data.toString();
        });
        flake8Process.on('close', (code) => {
            outputChannel.appendLine(`Linting Results using flake8:`);
            if (lintData.trim()) {
                lintData.split('\n').forEach(line => {
                    if (line) {
                        lintResults["Issues"].push(line.trim());
                    }
                });
                lintResults["Issues"].forEach(issue => outputChannel.appendLine(issue));
            }
            else if (code === 0) {
                outputChannel.appendLine("No linting issues found.");
            }
            else {
                outputChannel.appendLine("Failed to complete linting process. Please check if 'flake8' is installed and accessible.");
            }
            outputChannel.appendLine(`===============================================\n`);
            outputChannel.show(true);
            resolve();
        });
        flake8Process.on('error', (err) => {
            outputChannel.appendLine(`Error starting flake8 process: ${err.message}`);
            reject(err);
        });
        console.log("Linting complete.");
    });
}
function formatPythonFile(filePath) {
    return new Promise((resolve, reject) => {
        const originalContent = fs.readFileSync(filePath, 'utf8');
        outputChannel.appendLine("Formatting(black) and Sorting(isort) Imports for Python File:");
        outputChannel.appendLine(filePath);
        outputChannel.appendLine("===============================================");
        const blackProcess = (0, child_process_1.spawn)('black', [filePath], { shell: true });
        let blackOutput = '';
        blackProcess.stdout.on('data', (data) => {
            blackOutput += data.toString();
        });
        let blackError = '';
        blackProcess.stderr.on('data', (data) => {
            blackError += data.toString();
        });
        blackProcess.on('close', (blackCode) => {
            if (blackError.trim()) {
                outputChannel.appendLine(`Black output: ${blackError.trim()}`);
            }
            if (blackCode === 0) {
                if (blackOutput.includes("1 file reformatted") || blackOutput.includes("files reformatted")) {
                    outputChannel.appendLine("Black formatting applied successfully. File reformatted.");
                }
                else if (blackOutput.includes("1 file left unchanged") || blackOutput.includes("files left unchanged")) {
                    outputChannel.appendLine("Black formatting check completed. No changes necessary.");
                }
                else {
                    outputChannel.appendLine(blackOutput.trim());
                }
                sortImportsWithIsort(filePath, originalContent).then(resolve).catch(reject);
            }
            else {
                outputChannel.appendLine("Failed to format Python file with Black.");
                reject(new Error("Failed to format Python file with Black."));
            }
        });
    });
}
function sortImportsWithIsort(filePath, originalContent) {
    return new Promise((resolve, reject) => {
        const isortProcess = (0, child_process_1.spawn)('isort', [filePath], { shell: true });
        isortProcess.on('close', (isortCode) => {
            const newContent = fs.readFileSync(filePath, 'utf8');
            if (isortCode === 0 && originalContent !== newContent) {
                outputChannel.appendLine("isort import sorting applied.");
            }
            else if (isortCode === 0) {
                outputChannel.appendLine("isort import sorting check passed (no changes made).");
            }
            else {
                outputChannel.appendLine("Failed to sort imports with isort.");
                reject(new Error("Failed to sort imports with isort."));
                return;
            }
            if (isortCode === 0) {
                vscode.window.showInformationMessage('Python file formatted with Black and sorted with isort.');
            }
            else {
                vscode.window.showErrorMessage('Failed to format and sort Python file properly.');
            }
            outputChannel.appendLine("===============================================\n");
            outputChannel.show(true);
            resolve();
        });
    });
}
function analyzeCodeQuality(filePath) {
    return new Promise((resolve, reject) => {
        outputChannel.appendLine(`Analyzing code quality for: ${filePath}`);
        outputChannel.appendLine("===============================================");
        // Cyclomatic Complexity Analysis with Radon
        const ccProcess = (0, child_process_1.spawn)('radon', ['cc', '-s', filePath], { shell: true });
        let ccResults = '';
        ccProcess.stdout.on('data', (data) => ccResults += data.toString());
        ccProcess.stderr.on('data', (data) => outputChannel.appendLine(`Radon CC error: ${data}`));
        ccProcess.on('close', (code) => {
            outputChannel.appendLine("Cyclomatic Complexity Results:");
            if (code === 0 && ccResults.trim()) {
                outputChannel.appendLine(ccResults.trim());
            }
            else {
                outputChannel.appendLine('Failed to complete Cyclomatic Complexity analysis or no complexity issues found.');
            }
            outputChannel.appendLine("-----------------------------------------------");
            analyzeMaintainabilityIndex(filePath).then(() => {
                analyzeRawMetrics(filePath).then(() => {
                    outputChannel.appendLine("===============================================\n");
                    outputChannel.show(true);
                }).catch(reject);
            }).catch(reject);
        });
    });
}
function analyzeMaintainabilityIndex(filePath) {
    return new Promise((resolve, reject) => {
        const miProcess = (0, child_process_1.spawn)('radon', ['mi', '-s', filePath], { shell: true });
        let miResults = '';
        miProcess.stdout.on('data', (data) => miResults += data.toString());
        miProcess.on('close', (miCode) => {
            outputChannel.appendLine("Maintainability Index Results:");
            if (miCode === 0 && miResults.trim()) {
                outputChannel.appendLine(miResults.trim());
            }
            else {
                outputChannel.appendLine('Failed to complete Maintainability Index analysis or no MI issues found.');
            }
            outputChannel.appendLine("-----------------------------------------------");
            resolve();
        });
        miProcess.on('error', (err) => reject(err));
    });
}
function analyzeRawMetrics(filePath) {
    return new Promise((resolve, reject) => {
        const rawMetricsProcess = (0, child_process_1.spawn)('radon', ['raw', filePath], { shell: true });
        let rawMetrics = '';
        rawMetricsProcess.stdout.on('data', (data) => rawMetrics += data.toString());
        rawMetricsProcess.on('close', (rawCode) => {
            outputChannel.appendLine("Raw Metrics Results:");
            if (rawCode === 0 && rawMetrics.trim()) {
                outputChannel.appendLine(rawMetrics.trim());
            }
            else {
                outputChannel.appendLine('Failed to complete Raw Metrics analysis or no raw metrics found.');
            }
            resolve();
        });
        rawMetricsProcess.on('error', (err) => reject(err));
    });
}
function activate(context) {
    outputChannel.appendLine("Extension activated");
    outputChannel.show(true);
    // Define the workflow function
    function performAnalysisWorkflow(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            outputChannel.clear();
            outputChannel.appendLine(`Starting analysis for: ${filePath}`);
            outputChannel.appendLine("===============================================");
            try {
                // Step 1: Linting
                outputChannel.appendLine("Linting in progress...");
                yield lintPythonFile(filePath);
                outputChannel.appendLine("Linting completed successfully.");
            }
            catch (error) {
                outputChannel.appendLine(`Linting failed: ${error}`);
            }
            try {
                // Step 2: Formatting
                outputChannel.appendLine("Formatting in progress...");
                yield formatPythonFile(filePath);
                outputChannel.appendLine("Formatting completed successfully.");
            }
            catch (error) {
                outputChannel.appendLine(`Formatting failed: ${error}`);
            }
            try {
                // Step 3: Code Quality Analysis
                outputChannel.appendLine("Code quality analysis in progress...");
                yield analyzeCodeQuality(filePath);
                outputChannel.appendLine("Code quality analysis completed successfully.");
            }
            catch (error) {
                outputChannel.appendLine(`Code quality analysis failed: ${error}`);
            }
            outputChannel.appendLine("Analysis complete.");
            outputChannel.show(true);
        });
    }
    let command = vscode.commands.registerCommand('extension.startAnalysisWorkflow', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === "python") {
            performAnalysisWorkflow(editor.document.fileName);
        }
        else {
            vscode.window.showWarningMessage('Active file is not a Python file or no file is active.');
        }
    });
    context.subscriptions.push(command);
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(document => {
        if (document.languageId === "python") {
            performAnalysisWorkflow(document.fileName).catch(error => {
                console.error(`Failed to perform analysis on save: ${error}`);
            });
        }
    }));
    let lintCommand = vscode.commands.registerCommand('extension.lintPythonFile', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === "python") {
            try {
                yield lintPythonFile(editor.document.fileName);
                vscode.window.showInformationMessage('Linting completed successfully.');
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to complete linting: ${error}`);
                outputChannel.appendLine(`Error during linting: ${error}`);
            }
        }
        else {
            vscode.window.showWarningMessage('Active file is not a Python file or no file is active.');
        }
    }));
    context.subscriptions.push(lintCommand);
    let formatCommand = vscode.commands.registerCommand('extension.formatPythonFile', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === "python") {
            formatPythonFile(editor.document.fileName).catch(error => {
                vscode.window.showErrorMessage(`Failed to format file: ${error}`);
            });
        }
        else {
            vscode.window.showWarningMessage('Active file is not a Python file or no file is active.');
        }
    });
    context.subscriptions.push(formatCommand);
    let analyzeCommand = vscode.commands.registerCommand('extension.analyzeCodeQuality', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === "python") {
            try {
                yield analyzeCodeQuality(editor.document.fileName);
                vscode.window.showInformationMessage('Code quality analysis completed successfully.');
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to complete code quality analysis: ${error}`);
                outputChannel.appendLine(`Error during code quality analysis: ${error}`);
            }
        }
        else {
            vscode.window.showWarningMessage('Active file is not a Python file or no file is active.');
        }
    }));
    context.subscriptions.push(analyzeCommand);
}
exports.activate = activate;
function deactivate() {
    outputChannel.dispose();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
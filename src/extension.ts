import * as vscode from 'vscode';
import { GitAnalyzer } from './gitAnalyzer';
import { ChurnReportPanel } from './churnReportPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Code Churn Insights 插件已激活');

    const disposable = vscode.commands.registerCommand('codeChurn.analyzeRepository', async () => {
        try {
            // 检查是否有工作区
            if (!vscode.workspace.workspaceFolders) {
                vscode.window.showErrorMessage('请先打开一个工作区文件夹');
                return;
            }

            const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

            // 检查 Git 是否可用
            const gitAnalyzer = new GitAnalyzer(workspaceRoot);
            const isGitAvailable = await gitAnalyzer.checkGitAvailability();
            
            if (!isGitAvailable) {
                vscode.window.showErrorMessage('未检测到 Git，请确保 Git 已安装并在 PATH 中');
                return;
            }

            const isGitRepo = await gitAnalyzer.checkIsGitRepository();
            if (!isGitRepo) {
                vscode.window.showErrorMessage('当前工作区不是 Git 仓库');
                return;
            }

            // 显示进度条并执行分析
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "正在分析代码变动...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0, message: "读取 Git 日志..." });

                const config = vscode.workspace.getConfiguration('codeChurn.analysis');
                const since = config.get<string>('since', '90 days ago');
                const bugKeywords = config.get<string[]>('bugKeywords', ['fix', 'bug', 'hotfix', '修复']);
                const ignorePaths = config.get<string[]>('ignorePaths', []);

                const analysisData = await gitAnalyzer.analyze(since, bugKeywords, ignorePaths);

                progress.report({ increment: 100, message: "分析完成！" });

                // 创建并显示报告面板
                ChurnReportPanel.createOrShow(context.extensionUri, analysisData);
            });

        } catch (error) {
            vscode.window.showErrorMessage(`分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

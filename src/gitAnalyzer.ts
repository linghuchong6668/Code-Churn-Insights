import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export interface FileChurnData {
    filePath: string;
    totalChanges: number;
    bugFixChanges: number;
    linesAdded: number;
    linesDeleted: number;
}

export interface AnalysisResult {
    files: FileChurnData[];
    totalCommits: number;
    analyzedTimeRange: string;
}

export class GitAnalyzer {
    constructor(private workspaceRoot: string) {}

    /**
     * 检查 Git 是否可用
     */
    async checkGitAvailability(): Promise<boolean> {
        return new Promise((resolve) => {
            const git = spawn('git', ['--version']);
            git.on('error', () => resolve(false));
            git.on('close', (code) => resolve(code === 0));
        });
    }

    /**
     * 检查当前目录是否为 Git 仓库
     */
    async checkIsGitRepository(): Promise<boolean> {
        return new Promise((resolve) => {
            const git = spawn('git', ['rev-parse', '--git-dir'], {
                cwd: this.workspaceRoot
            });
            git.on('error', () => resolve(false));
            git.on('close', (code) => resolve(code === 0));
        });
    }

    /**
     * 执行 Git 分析
     */
    async analyze(since: string, bugKeywords: string[], ignorePaths: string[]): Promise<AnalysisResult> {
        const gitignorePatterns = this.loadGitignorePatterns();
        const allIgnorePatterns = [...gitignorePatterns, ...ignorePaths];

        return new Promise((resolve, reject) => {
            const args = [
                'log',
                '--pretty=format:[COMMIT_DELIMITER]%H|%s',
                '--numstat',
                `--since=${since}`,
                '--',
                this.workspaceRoot
            ];

            const git: ChildProcess = spawn('git', args, {
                cwd: this.workspaceRoot
            });

            let stdout = '';
            let stderr = '';

            git.stdout?.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            git.stderr?.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            git.on('error', (error: Error) => {
                reject(new Error(`Git 命令执行失败: ${error.message}`));
            });

            git.on('close', (code: number | null) => {
                if (code !== 0) {
                    reject(new Error(`Git 命令返回错误码 ${code}: ${stderr}`));
                    return;
                }

                try {
                    const result = this.parseGitLog(stdout, bugKeywords, allIgnorePatterns);
                    resolve({
                        ...result,
                        analyzedTimeRange: since
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * 加载 .gitignore 规则
     */
    private loadGitignorePatterns(): string[] {
        const gitignorePath = path.join(this.workspaceRoot, '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
            return [];
        }

        try {
            const content = fs.readFileSync(gitignorePath, 'utf-8');
            return content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
        } catch {
            return [];
        }
    }

    /**
     * 解析 git log 输出
     */
    private parseGitLog(logOutput: string, bugKeywords: string[], ignorePatterns: string[]): Omit<AnalysisResult, 'analyzedTimeRange'> {
        const fileDataMap = new Map<string, FileChurnData>();
        const commits = logOutput.split('[COMMIT_DELIMITER]').filter(c => c.trim());

        for (const commit of commits) {
            const lines = commit.split('\n');
            if (lines.length === 0) continue;

            // 第一行是提交信息: hash|subject
            const commitInfo = lines[0].trim();
            const [, commitMessage] = commitInfo.split('|');
            
            const isBugFix = this.isBugFixCommit(commitMessage || '', bugKeywords);

            // 解析 numstat 输出
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // numstat 格式: added deleted filepath
                const parts = line.split(/\s+/);
                if (parts.length < 3) continue;

                const [addedStr, deletedStr, ...filePathParts] = parts;
                const filePath = filePathParts.join(' ');

                // 跳过忽略的文件
                if (this.shouldIgnore(filePath, ignorePatterns)) {
                    continue;
                }

                const added = addedStr === '-' ? 0 : parseInt(addedStr, 10);
                const deleted = deletedStr === '-' ? 0 : parseInt(deletedStr, 10);

                if (!fileDataMap.has(filePath)) {
                    fileDataMap.set(filePath, {
                        filePath,
                        totalChanges: 0,
                        bugFixChanges: 0,
                        linesAdded: 0,
                        linesDeleted: 0
                    });
                }

                const fileData = fileDataMap.get(filePath)!;
                fileData.totalChanges++;
                if (isBugFix) {
                    fileData.bugFixChanges++;
                }
                fileData.linesAdded += added;
                fileData.linesDeleted += deleted;
            }
        }

        return {
            files: Array.from(fileDataMap.values()),
            totalCommits: commits.length
        };
    }

    /**
     * 判断是否为 Bug 修复提交
     */
    private isBugFixCommit(message: string, bugKeywords: string[]): boolean {
        const lowerMessage = message.toLowerCase();
        return bugKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
    }

    /**
     * 判断文件是否应被忽略
     */
    private shouldIgnore(filePath: string, patterns: string[]): boolean {
        return patterns.some(pattern => {
            // 简单的通配符匹配
            const regexPattern = pattern
                .replace(/\./g, '\\.')
                .replace(/\*\*/g, '.*')
                .replace(/\*/g, '[^/]*')
                .replace(/\?/g, '.');
            
            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(filePath);
        });
    }
}

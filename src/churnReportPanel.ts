import * as vscode from 'vscode';
import { AnalysisResult } from './gitAnalyzer';

export class ChurnReportPanel {
    public static currentPanel: ChurnReportPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, analysisData: AnalysisResult) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // 如果已有面板，则更新内容
        if (ChurnReportPanel.currentPanel) {
            ChurnReportPanel.currentPanel._panel.reveal(column);
            ChurnReportPanel.currentPanel._update(analysisData);
            return;
        }

        // 创建新面板
        const panel = vscode.window.createWebviewPanel(
            'codeChurnReport',
            'Code Churn 分析报告',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        ChurnReportPanel.currentPanel = new ChurnReportPanel(panel, extensionUri, analysisData);
    }

    
    private getIconUri(iconName: string): string {
        const iconPath = vscode.Uri.joinPath(this._extensionUri, 'resources', 'icons', iconName);
        return this._panel.webview.asWebviewUri(iconPath).toString();
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, analysisData: AnalysisResult) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // 设置初始内容
        this._update(analysisData);

        // 监听面板关闭
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // 处理来自 Webview 的消息
        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'openFile':
                        await this.openFile(message.filePath);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    private async openFile(filePath: string) {
        try {
            // 安全处理文件路径
            if (!vscode.workspace.workspaceFolders) {
                return;
            }

            const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const fullPath = vscode.Uri.file(`${workspaceRoot}/${filePath}`);

            const document = await vscode.workspace.openTextDocument(fullPath);
            await vscode.window.showTextDocument(document, {
                preview: false,
                selection: new vscode.Range(0, 0, 0, 0)
            });
        } catch (error) {
            vscode.window.showErrorMessage(`无法打开文件: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private _update(analysisData: AnalysisResult) {
        this._panel.webview.html = this._getHtmlContent(analysisData);
    }

    public dispose() {
        ChurnReportPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getHtmlContent(analysisData: AnalysisResult): string {
        const dataJson = JSON.stringify(analysisData);
        
        // 获取图标 URI
        const icons = {
            report: this.getIconUri('report.png'),
            quadrant: this.getIconUri('quadrant.png'),
            table: this.getIconUri('table.png'),
            riskHigh: this.getIconUri('risk-high.png'),
            riskActive: this.getIconUri('risk-active.png'),
            riskUnstable: this.getIconUri('risk-unstable.png'),
            riskStable: this.getIconUri('risk-stable.png')
        };

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Churn 分析报告</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        h1 {
            font-size: 24px;
            margin-bottom: 10px;
            color: var(--vscode-foreground);
        }

        .summary {
            margin-bottom: 20px;
            padding: 15px;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 5px;
        }

        .summary-item {
            display: inline-block;
            margin-right: 30px;
            font-size: 14px;
        }

        .summary-label {
            font-weight: bold;
            color: var(--vscode-textPreformat-foreground);
        }

        #chartContainer {
            width: 100%;
            height: 500px;
            margin-bottom: 30px;
            background-color: var(--vscode-editor-background);
        }

        .legend {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 3px;
        }

        h2 {
            font-size: 18px;
            margin: 30px 0 15px 0;
            color: var(--vscode-foreground);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--vscode-editor-background);
            margin-bottom: 20px;
        }

        th {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid var(--vscode-panel-border);
            cursor: pointer;
            user-select: none;
        }

        th:hover {
            background-color: var(--vscode-list-hoverBackground);
        }

        td {
            padding: 10px 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        tr:hover {
            background-color: var(--vscode-list-hoverBackground);
        }

        .file-link {
            color: var(--vscode-textLink-foreground);
            cursor: pointer;
            text-decoration: none;
        }

        .file-link:hover {
            text-decoration: underline;
            color: var(--vscode-textLink-activeForeground);
        }

        .risk-badge {
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .risk-high {
            background-color: #d73a4a;
            color: white;
        }

        .risk-active {
            background-color: #28a745;
            color: white;
        }

        .risk-unstable {
            background-color: #ffc107;
            color: black;
        }

        .risk-stable {
            background-color: #0366d6;
            color: white;
        }

        .sort-indicator {
            margin-left: 5px;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <h1><img src="${icons.report}" width="24" height="24" style="vertical-align: middle; margin-right: 8px;" />Code Churn 分析报告</h1>
    
    <div class="summary">
        <div class="summary-item">
            <span class="summary-label">分析时间范围:</span>
            <span id="timeRange"></span>
        </div>
        <div class="summary-item">
            <span class="summary-label">总提交数:</span>
            <span id="totalCommits"></span>
        </div>
        <div class="summary-item">
            <span class="summary-label">分析文件数:</span>
            <span id="totalFiles"></span>
        </div>
    </div>

    <h2><img src="${icons.quadrant}" width="20" height="20" style="vertical-align: middle; margin-right: 6px;" />风险象限图</h2>
    <div class="legend">
        <div class="legend-item">
            <div class="legend-color" style="background-color: #d73a4a;"></div>
            <span><img src="${icons.riskHigh}" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" />危险区域 (高变动/高Bug)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #28a745;"></div>
            <span><img src="${icons.riskActive}" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" />活跃区域 (高变动/低Bug)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #ffc107;"></div>
            <span><img src="${icons.riskUnstable}" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" />不稳定区域 (低变动/高Bug)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: #0366d6;"></div>
            <span><img src="${icons.riskStable}" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" />稳定区域 (低变动/低Bug)</span>
        </div>
    </div>

    <div id="chartContainer"></div>

    <h2><img src="${icons.table}" width="20" height="20" style="vertical-align: middle; margin-right: 6px;" />详细数据表格</h2>
    <table id="dataTable">
        <thead>
            <tr>
                <th data-sort="filePath">文件路径 <span class="sort-indicator"></span></th>
                <th data-sort="totalChanges">总变动次数 <span class="sort-indicator">▼</span></th>
                <th data-sort="bugFixChanges">Bug修复次数 <span class="sort-indicator"></span></th>
                <th data-sort="linesAdded">新增行数 <span class="sort-indicator"></span></th>
                <th data-sort="linesDeleted">删除行数 <span class="sort-indicator"></span></th>
                <th>风险等级</th>
            </tr>
        </thead>
        <tbody id="tableBody">
        </tbody>
    </table>

    <script>
        const vscode = acquireVsCodeApi();
        const analysisData = ${dataJson};
        const icons = {
            riskHigh: '${icons.riskHigh}',
            riskActive: '${icons.riskActive}',
            riskUnstable: '${icons.riskUnstable}',
            riskStable: '${icons.riskStable}'
        };

        // 初始化摘要
        document.getElementById('timeRange').textContent = analysisData.analyzedTimeRange;
        document.getElementById('totalCommits').textContent = analysisData.totalCommits;
        document.getElementById('totalFiles').textContent = analysisData.files.length;

        // 计算风险等级
        function calculateRiskLevel(file, medianChanges, medianBugFixes) {
            const highChanges = file.totalChanges > medianChanges;
            const highBugs = file.bugFixChanges > medianBugFixes;

            if (highChanges && highBugs) return { level: 'high', label: '<img src="' + icons.riskHigh + '" width="14" height="14" style="vertical-align: middle;" /> 危险', class: 'risk-high' };
            if (highChanges && !highBugs) return { level: 'active', label: '<img src="' + icons.riskActive + '" width="14" height="14" style="vertical-align: middle;" /> 活跃', class: 'risk-active' };
            if (!highChanges && highBugs) return { level: 'unstable', label: '<img src="' + icons.riskUnstable + '" width="14" height="14" style="vertical-align: middle;" /> 不稳定', class: 'risk-unstable' };
            return { level: 'stable', label: '<img src="' + icons.riskStable + '" width="14" height="14" style="vertical-align: middle;" /> 稳定', class: 'risk-stable' };
        }

        // 计算中位数
        function median(values) {
            if (values.length === 0) return 0;
            const sorted = [...values].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
        }

        const medianChanges = median(analysisData.files.map(f => f.totalChanges));
        const medianBugFixes = median(analysisData.files.map(f => f.bugFixChanges));

        // 渲染散点图
        function renderChart() {
            const chart = echarts.init(document.getElementById('chartContainer'));

            const data = analysisData.files.map(file => {
                const risk = calculateRiskLevel(file, medianChanges, medianBugFixes);
                return {
                    value: [file.totalChanges, file.bugFixChanges],
                    name: file.filePath,
                    itemStyle: {
                        color: risk.level === 'high' ? '#d73a4a' :
                               risk.level === 'active' ? '#28a745' :
                               risk.level === 'unstable' ? '#ffc107' : '#0366d6'
                    }
                };
            });

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return \`\${params.data.name}<br/>变动次数: \${params.data.value[0]}<br/>Bug修复: \${params.data.value[1]}\`;
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%',
                    top: '10%'
                },
                xAxis: {
                    type: 'value',
                    name: '总变动次数',
                    nameLocation: 'middle',
                    nameGap: 30,
                    splitLine: { show: true }
                },
                yAxis: {
                    type: 'value',
                    name: 'Bug修复次数',
                    nameLocation: 'middle',
                    nameGap: 40,
                    splitLine: { show: true }
                },
                series: [{
                    type: 'scatter',
                    symbolSize: 10,
                    data: data,
                    emphasis: {
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    }
                }],
                // 添加象限分割线
                markLine: {
                    silent: true,
                    lineStyle: {
                        type: 'dashed',
                        color: '#999'
                    },
                    data: [
                        { xAxis: medianChanges },
                        { yAxis: medianBugFixes }
                    ]
                }
            };

            chart.setOption(option);

            // 点击散点打开文件
            chart.on('click', (params) => {
                vscode.postMessage({
                    command: 'openFile',
                    filePath: params.data.name
                });
            });
        }

        // 渲染表格
        let currentSort = { column: 'totalChanges', ascending: false };

        function renderTable(sortColumn = 'totalChanges', ascending = false) {
            const sortedFiles = [...analysisData.files].sort((a, b) => {
                const valA = a[sortColumn];
                const valB = b[sortColumn];
                return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
            });

            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            sortedFiles.forEach(file => {
                const risk = calculateRiskLevel(file, medianChanges, medianBugFixes);
                const row = tbody.insertRow();
                row.innerHTML = \`
                    <td><a class="file-link" data-file="\${file.filePath}">\${file.filePath}</a></td>
                    <td>\${file.totalChanges}</td>
                    <td>\${file.bugFixChanges}</td>
                    <td>\${file.linesAdded}</td>
                    <td>\${file.linesDeleted}</td>
                    <td><span class="risk-badge \${risk.class}">\${risk.label}</span></td>
                \`;
            });

            // 更新排序指示器
            document.querySelectorAll('th .sort-indicator').forEach(el => el.textContent = '');
            const th = document.querySelector(\`th[data-sort="\${sortColumn}"] .sort-indicator\`);
            if (th) {
                th.textContent = ascending ? '▲' : '▼';
            }

            // 添加文件链接点击事件
            document.querySelectorAll('.file-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    vscode.postMessage({
                        command: 'openFile',
                        filePath: link.dataset.file
                    });
                });
            });
        }

        // 表头排序
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                const ascending = currentSort.column === column ? !currentSort.ascending : false;
                currentSort = { column, ascending };
                renderTable(column, ascending);
            });
        });

        // 初始化渲染
        renderChart();
        renderTable();
    </script>
</body>
</html>`;
    }
}

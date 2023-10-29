import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "function-commenter" is now active!')

  // const ex: vscode.Extension<any> | undefined = vscode.extensions.getExtension('@e_iis.helloworld')
  // console.log(ex)

  // const version: string = ex ? ex.packageJSON.version : ''
  // vscode.window.showInformationMessage(`Background Cover Extension Version: ${version}`)

  // 创建状态栏按钮
  const statusBarBtn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarBtn.tooltip = 'Current Time'

  // 显示当前时间并设置一个间隔每秒更新一次
  const updateCurrentTime = () => {
    const currentTime = new Date().toLocaleTimeString()
    statusBarBtn.text = currentTime
  }

  // 初始化时间
  updateCurrentTime()

  // 每秒更新一次时间
  const interval = setInterval(updateCurrentTime, 1000)

  statusBarBtn.show()

  // 当扩展被停用时，清除间隔以防止内存泄露
  context.subscriptions.push({
    dispose: () => {
      clearInterval(interval)
    },
  })

  const disposable = vscode.commands.registerCommand('extension.addFunctionComment', () => {
    // 获取当前编辑器
    const editor = vscode.window.activeTextEditor
    if (!editor)
      return

    // 获取用户选择的文本
    const selection = editor.selection
    const text = editor.document.getText(selection)

    // 检查选择的文本是否是函数
    if (text.includes('function') || (text.includes('=>') && text.includes('('))) {
      // 创建评论内容
      const userName = 'ChatGPT' // 这里可以替换成动态获取的用户名或其他信息
      const commentText = `// This function was created by ${userName}\n`

      // 插入评论
      editor.edit((editBuilder) => {
        editBuilder.insert(selection.start, commentText)
      })
    }
    else {
      vscode.window.showInformationMessage('Please select a function!')
    }
  })

  const hoverProvider = vscode.languages.registerHoverProvider(
    { pattern: '**/*.js' }, // 你可以指定为特定的文件类型，这里我们选择了所有的JS文件
    {
      provideHover(document, position, _token) {
        const range = document.getWordRangeAtPosition(position)
        const word = document.getText(range)

        if (word)
          return new vscode.Hover('🐶🐷🐔🦊加入开发者微信群聊🐯🐮🐹🐽❓')
      },
    },
  )

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { pattern: '**/*', language: 'javascript' }, // 你可以根据需要调整文件模式和语言
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character)
        if (linePrefix.endsWith('fugui')) {
          return [
            {
              label: 'fugui.log()',
              kind: vscode.CompletionItemKind.Method,
              insertText: 'fugui.log()',
              detail: 'Log a message with fugui',
            },
          ]
        }
      },
    },
  )

  context.subscriptions.push(disposable)
  context.subscriptions.push(hoverProvider)
  context.subscriptions.push(completionProvider)
}

export function deactivate() {}

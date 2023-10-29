import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "function-commenter" is now active!')

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

        return new vscode.Hover(word)
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

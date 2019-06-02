import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.newBlogPost', newBlogPost),
  )
}

function newBlogPost(args: any) {
  promptAndSave(args, 'post')
}

// https://github.com/jchannon/csharpextensions/blob/master/src/extension.ts#L49
function promptAndSave(args: any, templatetype: string) {
  if (!args) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingpath: string = args._fsPath
  vscode.window
    .showInputBox({
      ignoreFocusOut: true,
      prompt: 'Please enter the filename',
      value: `new-${templatetype}.md`,
    })
    .then(newfilename => {
      if (typeof newfilename === 'undefined') {
        return
      }

      var filepath = incomingpath + path.sep + newfilename

      if (fs.existsSync(filepath)) {
        vscode.window.showErrorMessage('File already exists')
        return
      }

      filepath = correctExtension(filepath)

      const templatePath =
        vscode.extensions.getExtension('timdeschryver.new-blog-post')!
          .extensionPath + '/templates/post.template'

      vscode.workspace
        .openTextDocument(templatePath)
        .then((doc: vscode.TextDocument) => {
          let text = doc.getText()
          text = text.replace('${timestamp}', new Date().toISOString())
          text = text.replace('${motivate}', motivate())

          let cursorPosition = findCursorInTemlpate(text)
          text = text.replace('${cursor}', '')

          fs.writeFileSync(filepath, text)

          vscode.workspace.openTextDocument(filepath).then(doc => {
            vscode.window.showTextDocument(doc).then(editor => {
              let newselection = new vscode.Selection(
                cursorPosition,
                cursorPosition,
              )
              editor.selection = newselection
            })
          })
        })
    })
}

function findCursorInTemlpate(text: string) {
  let cursorPos = text.indexOf('${cursor}')
  let preCursor = text.substr(0, cursorPos)
  let lineNum = preCursor.match(/\n/gi)!.length
  let charNum = preCursor.substr(preCursor.lastIndexOf('\n')).length
  return new vscode.Position(lineNum, charNum)
}

function correctExtension(filename: string, extension = 'md') {
  if (path.extname(filename) !== `.${extension}`) {
    if (filename.endsWith('.')) {
      filename = filename + extension
    } else {
      filename = filename + `.${extension}`
    }
  }
  return filename
}

function motivate() {
  const quotes = [
    'The way to get started is to quit talking and begin doing. - Walt Disney',
    'It does not matter how slowly you go, so long as you do not stop. - Confucius',
    `Opportunities don't happen. You create them. - Chris Grosser`,
    'Try not to become a person of success, but rather try to become a person of value. - Albert Einstein',
    'Great minds discuss ideas; average minds discuss events; small minds discuss people. - Eleanor Roosevelt',
    'I find that the harder I work, the more luck I seem to have. - Thomas Jefferson',
    'Nothing great was ever achieved without enthusiasm. - Ralph Waldo Emerson',
    'Whatever the mind of man can conceive and believe, it can achieve. – Napoleon Hill',
    'You miss 100% of the shots you don’t take. – Wayne Gretzky',
    'Winning isn’t everything, but wanting to win is. – Vince Lombardi',
  ]

  return quotes[Math.floor(Math.random() * quotes.length)]
}

// this method is called when your extension is deactivated
export function deactivate() {}

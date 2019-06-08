import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { getSetting } from './utils'

// https://github.com/jchannon/csharpextensions/blob/master/src/extension.ts#L49
export function createBlogPost(args: any) {
  if (!args) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingpath: string = args._fsPath
  vscode.window
    .showInputBox({
      ignoreFocusOut: true,
      prompt: 'Please enter the filename',
      value: `new-blog-post.md`,
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

      const templatePath = getTemplate()
      vscode.workspace
        .openTextDocument(templatePath)
        .then((doc: vscode.TextDocument) => {
          let text = doc.getText()
          text = fillInTextParams(text)

          let cursorPosition = findCursorInTemplate(text)
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

function findCursorInTemplate(text: string) {
  let cursorPos = text.indexOf('${cursor}')
  let preCursor = text.substr(0, cursorPos)
  let lineNum = preCursor.match(/\n/gi)
  if (!lineNum) {
    return new vscode.Position(0, 0)
  }
  let charNum = preCursor.substr(preCursor.lastIndexOf('\n')).length
  return new vscode.Position(lineNum.length, charNum)
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

function fillInTextParams(text: string) {
  const defaults = {
    timestamp: 'new Date().toISOString()',
    published: '"false"',
    tags: '""',
  }

  try {
    const variablesSetting = JSON.stringify(getSetting('templateVariables'))
    const variables = JSON.parse(variablesSetting)

    Object.entries({ ...defaults, ...variables }).forEach(
      ([key, value]: any[]) => {
        text = text.replace(`\${${key}}`, eval(value))
      },
    )
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }

  return text
}

function getTemplate() {
  const extensionPath = vscode.extensions.getExtension(
    'timdeschryver.new-blog-post',
  )!.extensionPath
  const extensionTemplate = (name: string) =>
    extensionPath + `/templates/${name}.template`
  const template = getSetting('template')

  const templates: any = {
    'dev.to': extensionTemplate('devto'),
  }

  return templates[template] || template
}

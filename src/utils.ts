import * as vscode from 'vscode'

export function getSetting(key: string) {
  return vscode.workspace.getConfiguration('post').get(key, '')
}

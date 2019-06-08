import * as vscode from 'vscode'
import { createBlogPost } from './create-blog-post'
import { publishToDevTo } from './devto'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.newBlogPost', createBlogPost),
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.publishToDevTo', publishToDevTo),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}

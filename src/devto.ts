import * as vscode from 'vscode'
import * as fm from 'front-matter'
import fetch from 'node-fetch'
import { getSetting } from './utils'

export function publishToDevTo() {
  if (!vscode.window.activeTextEditor) {
    vscode.window.showInformationMessage(
      'You have to have the post open in order to publish it',
    )
    return
  }

  const token = getSetting('publishToken')
  if (!token) {
    vscode.window.showInformationMessage(
      'You must provide a dev.to token via the `post.publishToken`',
    )
    return
  }

  try {
    const post = vscode.window.activeTextEditor.document.getText()
    const { attributes, body }: { attributes: any; body: string } = fm(post)
    publish(body, attributes, token)
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}

/**
 * https://dev.to/api
 *
 * title: The title of an article (string, optional)
 * description: Description of the article (string, optional)
 * body_markdown: The Markdown body, with or without a front matter (string, required)
 * published: True if the article should be published right away, defaults to false (boolean, optional)
 * tags: A list of tags for the article (array, optional)
 * series: The name of the series the article should be published within (string, optional)
 * publish_under_org: True if the article should be placed under the organization belonging to the user creating the  * article, defaults to false (boolean, optional)
 * main_image: URL of the image to use as the cover (string, optional)
 * canonical_url: canonical URL of the article (string, optional)
 *
 * curl -X POST -H "Content-Type: application/json" \
 * -H "api-key: ACCESS_TOKEN" \
 * -d '{"article": {"body_markdown": "---\ntitle: A sample article about...\npublished: false\n...", "publish_under_org": true}}' \
 * https://dev.to/api/articles
 *
 */

function publish(body: string, frontMatter: any, token: string) {
  const data = {
    article: {
      title: frontMatter['title'],
      description: frontMatter['description'],
      published: frontMatter['published'],
      tags: (frontMatter['tags'] || '').split(',').map((p: string) => p.trim()),
      series: frontMatter['series'],
      publish_under_org: frontMatter['publish_under_org'],
      main_image: frontMatter['cover_image'],
      canonical_url: frontMatter['canonical_url'],
      body_markdown: body,
    },
  }

  fetch('https://dev.to/api/articles', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'api-key': token,
    },
  })
    .then((res: any) => res.json())
    .then((data: any) => {
      if (data.error) {
        vscode.window.showErrorMessage(data.error)
      } else {
        vscode.window.showInformationMessage(
          `Post has successfully been published to dev.to`,
        )
      }
    })
    .catch((err: any) => {
      vscode.window.showErrorMessage(err)
    })
}

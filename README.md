# 📝 New Blog Post

> Create a new blog post with ease

![Gif on how to create a new blog post](https://raw.githubusercontent.com/timdeschryver/new-blog-post/master/other/new-blog-post.gif)

## Commands

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| 📝New Blog Post | Creates a markdown file based on the template |

## Settings

| Property        | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| `post.author`   | The author of the post, will be used to override the `${author}` variable in the template |
| `post.template` | Can have the values: `default`, `dev.to`, or an obsolete path to your own template        |

## Template variables

| Variable       | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| `${author}`    | The value defined in `post.author`, blanco if left empty        |
| `${timestamp}` | The current timestamp in ISO format, `2019-06-02T19:03:43.412Z` |
| `${cursor}`    | Where the cursor will be at after creating the file             |
| `${motivate}`  | A motivational text                                             |

## Default template

The default template looks as follows:

```md
---
title:
description:
slug:
tags:
author: ${author}
date: ${timestamp}
---

## Header

\${motivate}
```

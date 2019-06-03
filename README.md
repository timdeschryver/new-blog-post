# 📝 New Blog Post

> Create a new blog post with ease

![Gif on how to create a new blog post](https://raw.githubusercontent.com/timdeschryver/new-blog-post/master/other/new-blog-post.gif)

## Commands

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| 📝New Blog Post | Creates a markdown file based on the template |

## Settings

| Property                 | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `post.template`          | Can have the values: `default`, `dev.to`, or an obsolete path to your own template |
| `post.templateVariables` | Define your own template, [more info](#Template-Variables)                         |

## Template variables

### Define custom variables

You can define your own variables with the `templateVariables` variable, which is an object.

The key will be used to find the variable tag. To create a variable tag in the template surround it with `${}`, for example `${author}`.

The value will be evaluated with the `eval` function. This has the advantage that we have the possibility to define "dynamic" variables, but has as disadvantage that simple string values have to be surrounded with quotes.

```json
"post.templateVariables": {
  "author": "'Tim Deschryver'",
  "timestamp": "new Date().toISOString()"
}
```

### Predefined template variables

| Variable       | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| `${timestamp}` | The current timestamp in ISO format, `2019-06-02T19:03:43.412Z` |
| `${motivate}`  | A motivational text                                             |
| `${cursor}`    | Where the cursor will be at after creating the file             |

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

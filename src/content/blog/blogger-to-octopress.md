---
title: "Blogger to Octopress"
date: 2014-01-20
description: "Migrating from Blogger to Octopress on GitHub Pages"
---

Recently shifted my blog from Blogger to Octopress.

## Blogger world

Ridiculously easy to set up. Custom domain without much hassle. Awesome support for SEO and analytics.

## Running into problems with Blogger

1. No markdown support
2. Getting code in your blog could be ugly
3. WYSIWYG editor is a big fat lie
4. Very limited templates
5. Doesn't have a hacker workflow — Sublime, git, markdown, CLI

## The search

Tried WordPress (plugin issues, MySQL dependency), DocPad, Ghost, Hexo. Couldn't relate to any of them.

## Octopress

Discovered through GitHub Pages and Jekyll. Runs on Jekyll, very easy to use, supports the desired workflow.

**Getting started:** Requires Ruby. **Gotcha:** Stick with Ruby 1.9.3, don't try 2.0.

**Porting old blogs:** Export blogger XML, use a Ruby gist to convert. **Gotcha:** Need nokogiri gem: `gem install nokogiri --pre`

**Deploying to GitHub Pages:** No runtime dependency — just HTML, CSS, JS. **Gotcha:** Deploying to username.github.io messes up project pages. Add CNAME file, edit DNS entry.

**Adding Disqus comments:** Setup account with Disqus, add `disqus_short_name` to `_config.yml`. **Gotcha:** Set `comments: true` flag in every post.

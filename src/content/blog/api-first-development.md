---
title: "API-First Development"
date: 2013-12-25
description: "Why separating the view layer from business logic leads to better software"
---

> Change is the only constant.

In today's world, "computation" is being used in systems other than computers more frequently. The Internet of Things is coming along nicely. This imposes some changes in the traditional concept of software.

## What's MVC anyway?

MVC stands for model-view-controller. Model represents business objects, View is the HTML, Controller is the glue. The view-layer is a client interface wrapping business logic.

## It's not just one view now

With smartphones and BYOD, end users prefer mobile devices. It is not sufficient to design in traditional MVC. Responsive web design doesn't have native look and feel. HTML5 might seem promising, but poor support for JS-heavy apps makes some apps slow on certain devices.

## Enter API-first

Take the view-layer out from the picture and focus on business logic. Think about what operations the user can perform, wrap them in a URL and you have an API. Now any view can be plugged in or out easily.

**Best practices:**

1. Keep API structure meaningful
2. Keep APIs stateless
3. Use HTTP verbs to their fullest
4. Document your APIs — it's really important

API-first development allows you to highly reuse code, helps implement SOA, and boosts overall development time.

---
title: "Web App Concepts"
date: 2015-04-09
description: "The fundamental concepts shared by every web application framework"
---

Web application frameworks take care of repetitive tasks. I've worked with ASP.Net MVC, Play, Express, Sails, Spring, Django, and Martini. They are built on the same fundamentals. It's easy to pick up any framework once the concepts are understood.

## No magic

Someone somewhere has written that code so you don't have to. Open source — you can always check the implementation.

## HTTP HTTP HTTP

Everything starts and ends with HTTP. Understand the request-response cycle.

## Where's the entry point?

Routes definition — where developers can interact with the request. The framework parses and constructs a request object from the HTTP packet.

## But how do I know this request is valid?

Authentication: mapping of session IDs and session data. This layer is middleware.

## What next?

Controllers: primary logic that talks with data interfaces to combine and manipulate data.

## Where's my data coming from?

Models represent data tables or collections. Some frameworks provide associations, some emphasize BYORM. Cache for minimizing expensive database calls.

## We need to respond something, right?

Data transformed to JSON or HTML. The framework handles HTTP packet creation and sending back to clients.

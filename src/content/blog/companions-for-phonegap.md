---
title: "Companions for PhoneGap"
date: 2013-09-27
description: "Choosing the right frameworks and tools for PhoneGap development"
---

Phonegap has opened up a whole new way of creating mobile applications. In a nutshell, it follows the "write once, run anywhere" principle. There are some obvious trade-offs of using PhoneGap, but once you decide upon this framework, there is still some further R&D required — which mobile framework should I choose? How do I build for various platforms? And so on.

The main problem with the JavaScript world is there are just too many options to choose from. Every other day there comes a new framework claiming it makes development far easier than others. As a result there is nothing like one framework to rule them all. So it ultimately boils down to a soup of frameworks which you have to choose. However, just like any other application, JS apps can be broken down to two separate layers of UI and Logic.

## UI Frameworks

In case of UI, it's mostly CSS magic. Points to consider:

1. Supports CSS3 transitions — CSS3 is the fastest way to animate in browser
2. Provides wide range of mobile controls
3. Supports vector icons
4. Grid support is a must
5. Has helper classes for creating common elements such as action bar, tab navigation
6. Should be lightweight (in size and complexity of rules)

Also make sure you **test on actual device** before zeroing down on a framework. **Device emulator in Chrome doesn't give you the real picture!**

## Backend

For the logic part, most of the UI frameworks give you a way of listening to events. But that's not enough for a large application. TodoMVC helps compare popular MV* frameworks.

## Building Your Application

There is a great tool to build your application for all platforms: PhoneGap Build. You can hook it up with a GitHub repository, start the build, download the APK and you're done. They also have APIs for programmatic builds.

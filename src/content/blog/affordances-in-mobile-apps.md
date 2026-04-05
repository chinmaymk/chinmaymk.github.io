---
title: "Affordances in Mobile Apps"
date: 2015-05-16
description: "Why familiar patterns and deterministic behavior matter in mobile UX"
---

The human brain learns patterns that become reflexes. Mobile app UX is limited by tiny screens, touch controls, and sensors. Establishing deterministic, familiar patterns is crucial.

## Platform-defined gestures

iOS provides left-swipe and right-swipe gestures for list views. But some apps don't use them. Remedy: use gestures defined by the operating system for consistent UX.

## Meaningful icons

iOS changed button style to textual representation for clarity. Some icons are strongly associated with actions (refresh, stop, back). Adding new icons in mobile is harder since there's no hover metadata. Use standard icons or textual buttons when the meaning isn't immediately clear.

## Deterministic behavior

Actions must be repeatable. Mobile apps depend on data connection but often fail ungracefully when the connection is absent — like when a train enters a tunnel.

Applications should indicate which actions are disabled while waiting for connectivity rather than failing silently. Gmail and Flickr have started doing this well.

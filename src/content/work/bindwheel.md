---
title: Bindwheel
summary: A spirit-binding tactics game that runs in the browser, on desktop and on your phone.
category: Games
year: 2026
role: Programming, game design
stack: [React, React Three Fiber, Expo, Electron, SpacetimeDB]
clip: /media/work/bindwheel/loop.mp4
poster: /media/work/bindwheel/loop.jpg
links:
  - { label: Bindwheel on the studio site, url: 'https://kindawhimsical.com/games/bindwheel/' }
featured: false
order: 6
---

A tactics game about a crew of three bound spirits: one in front, one dealing damage and one keeping everyone alive. Fight it out automatically, or call every move yourself and react to what your opponent does.

The interesting part technically is that the same game runs in three places from one codebase: a full version in the browser and on desktop through Electron, and a simpler one on phones through Expo. Battles are deterministic and seeded, so they can be replayed, checked on the server and used for asynchronous PvP.

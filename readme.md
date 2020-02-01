# GBF Bookmarker

![Preview](readme_assets/popup.png)

## Index

- [What it does](#what-it-does)
- [How it works](#how-it-works)
- [Limitations](#limitations)
- [Special bookmarks](#special-bookmarks)
- [Bookmarks list](#bookmarks-list)
- [Installation](#installation)
- [Update](#update)
- [Configuration](#configuration)

## What it does

GBF Bookmarker is a [Chrome](https://www.google.com/chrome/) [extension](https://developer.chrome.com/extensions) that provides [bookmarks](<https://en.wikipedia.org/wiki/Bookmark_(digital)>) to all the features one might possible want to access in [Granblue Fantasy](http://game.granbluefantasy.jp). The visibility for every bookmark group can be individually configured from the options page, accessible from the extension's menu itself.

## How it works

It watches changes to URLs to register changing URLs, such as events, and saves them to the extension storage for later use. It also uses this same storage to save user preferences, which dictate which bookmark groups will show in the extension's menu.

The extension _only_ communications with the browser through the [Chrome Extension API](https://developer.chrome.com/extensions/api_index). Nothing is ever injected into the game, so the extension should be undetectable.

\* _**Disclaimer**_: even so, I will not be held responsible for anything that happens to you if you decide to use the extension.

## Limitations

As there's no real communication with the game, quests with requirements or limited daily runs will return an error when you enter them if you're not supposed to be able. This can be fixed by navigating to a different bookmark.

For temporal quests and events (including Guild Wars), you will likely be redirected to the home page instead.

## Special bookmarks

There are some special bookmarks that work by saving the latest URL the user visited matching certain rules. These include:

- **Repeat Quest**: will take you to the last quest where a support summon was selected. Quests with no support summon will not register and I have found no way around this. Luckily, they are a vast minority.

- **Guild Wars**: will take you to the last guild wars (AKA [Unite and Fight](https://gbf.wiki/Unite_and_Fight)) you visited.

- **Event**: will take you to the last event you visited.

## Bookmarks list

### [Bookmarks list](readme_assets/sections/bookmarks-list.md)

## Installation

Chrome's extension store is not free to publish to, so the extension requires to be installed manually. You can follow [these instructions](readme_assets/sections/installation.md) in order to do so (you will need to download and decompress the extension first).

![Download](readme_assets/download.png)

## Update

1. Download the updated files.
2. Extract them in the location of your current version of the extension and override them.
3. Load the updated extension from the "Load unpacked" button ([instructions](readme_assets/sections/installation.md)).

_NOTE:_ Ocasionally Chrome may think the reimported extension is a differnet one and you will end up with two loaded versions of it. To solve this issue, export your settings on the old version, import them on the new one and delete the former (instructions below).

## Configuration

You can select which menu items you want to see by tapping the "Options" menu item in the extension's popup. You can also export and import your settings, as well as reset them to default.

![Options](readme_assets/options.png)

Additionally, you can configure the extension shortcuts under the URL [chrome://extensions/shortcuts](chrome://extensions/shortcuts)

![Shortcuts](readme_assets/shortcuts.png)

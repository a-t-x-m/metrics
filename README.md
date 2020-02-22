# @atxmtx/metrics

[![npm](https://flat.badgen.net/npm/license/@atxmtx/metrics)](https://www.npmjs.org/package/@atxmtx/metrics)
[![npm](https://flat.badgen.net/npm/v/@atxmtx/metrics)](https://www.npmjs.org/package/@atxmtx/metrics)
[![CircleCI](https://flat.badgen.net/circleci/github/atxmtx/metrics)](https://circleci.com/gh/atxmtx/metrics)
[![David](https://flat.badgen.net/david/dep/atxmtx/metrics)](https://david-dm.org/atxmtx/metrics)

Google Analytics event tracking for Atom packages

## Installation

`npm install @atxmtx/metrics -S`

## Usage

### Basic Examples

Once the Metrics class has been instantiated, events can be fired from anywhere in your package.

```js
// JavaScript
import Metrics from '@atxmtx/metrics';

export async function activate() {
    const ga = new Metrics('UA-XXXX-Y');

    ga.event({
      category: 'Demo',
      action: 'Package activated!'
    });
};
```

```coffee
# CoffeeScript
const Metrics = require "@atxmtx/metrics"

module.exports =
  activate: () ->
    ga = new Metrics("UA-XXXX-Y");

    ga.event {
      category: "Demo"
      action: "Package activated!"
    }
```

### Command Metrics Example

Command metrics allow simple tracking of invoked package commands. In the following example, all commands provided by the `settings-view` package will be tracked by Google Analytics.

```js
// JavaScript
import Metrics from '@atxmtx/metrics';

export async function activate() {
    new Metrics('UA-XXXX-Y', {
      commandCategory: 'Settings View Commands',
      commandAction: [
        'settings-view:*'
      ]
    });
};
```

```coffee
# CoffeeScript
const Metrics = require "@atxmtx/metrics"

module.exports =
  activate: () ->
    new Metrics('UA-XXXX-Y',
      commandCategory: 'Settings View Commands'
      commandAction: [
        'settings-view:*'
      ])
```

### Methods

#### constructor

Usage: `new Metrics(trackingID: string, options: object)`

Instantiates class and adds event listeners, unless [`option.muted`](#muted) is used

#### listen

Usage: `listen()`

Manuall add event listener, e.g. for when [`option.muted`](#muted) is `true`

#### mute

Usage: `mute()`

Removes event listener

#### event

Usage: `event({ category: string, action: string, label?: string, value?: number})`

Sends an event to Google Analystics

### Options

#### commandAction

Type: `string | string[]`

Used to track specified package commands, supports wildcards (e.g. `my-package:*`).

#### commandCategory

Type: `string`
Default: `Package Command`

Default event category for package commands.

#### cacheBuster

Type: `boolean`
Default: `false`

Used to send a random number in GET requests to ensure browsers and proxies don't cache hits.

### muted

Type: `boolean`
Default: `false`

Skips add event listeners when the class is instantiated.

## License

This work is dual-licensed under [The MIT License](https://opensource.org/licenses/MIT) and the [GNU General Public License, version 2.0](https://opensource.org/licenses/GPL-2.0)

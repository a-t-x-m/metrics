# @atxmtx/metrics

[![npm](https://flat.badgen.net/npm/license/@atxmtx/metrics)](https://www.npmjs.org/package/@atxmtx/metrics)
[![npm](https://flat.badgen.net/npm/v/@atxmtx/metrics)](https://www.npmjs.org/package/@atxmtx/metrics)
[![CircleCI](https://flat.badgen.net/circleci/github/atxmtx/metrics)](https://circleci.com/gh/atxmtx/metrics)
[![David](https://flat.badgen.net/david/dep/atxmtx/metrics)](https://david-dm.org/atxmtx/metrics)

Sends events to Google Analytics from within Atom

## Installation

`npm install @atxmtx/metrics -S`

## Usage

**Examples**:

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

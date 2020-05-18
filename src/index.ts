'use strict';

import { createHash } from 'crypto';
import { log } from '@atxm/developer-console';
import { mac as getMAC } from 'address';
import { sep } from 'path';
import { v4 as uuid } from 'uuid';
import callerCallsite from 'caller-callsite';
import queryString from 'query-string';

export default class Metrics {
  clientID: string;
  options: MetricsOptions = {
    commandTracking: true,
    commandCategory: 'Package Command'
  };
  title: string = '@atxm/metrics';
  trackingID: string;

  constructor(trackingID: string, options: MetricsOptions = {}) {
    this.options = { ...this.options, ...options };

    if (this.options.consentSetting?.length && atom.config.get(this.options.consentSetting) !== true) {
      log(`${this.title}: No consent given by the user, aborting tracking`);
      return;
    }

    if (atom.inDevMode() && this.options.trackDevMode !== true) {
      log(`${this.title}: Tracking has not been enabled for Developer Mode, aborting`);
      return;
    }

    if (atom.inSpecMode() && !this.options.trackSpecMode !== true) {
      log(`${this.title}: Tracking has not been enabled for Spec Mode, aborting`);
      return;
    }

    this.trackingID = trackingID;
    this.clientID = this.getClientID();

    if (!this.options.muted) {
      this.listen();
    }

    if (!this.options.commandTracking) {
      this.commandListener();
    }
  }

  public listen() {
    log(`${this.title}: Adding event listener`);

    (<any>global).addEventListener(this.title, this.handler.bind(this));
  }

  public mute() {
    log(`${this.title}: Removing event listener`);

    (<any>global).removeEventListener(this.title, this.handler.bind(this));
  }

  public event(payload: GoogleEvent) {
    const customEvent = new CustomEvent(
      this.title,
      {
        detail: payload
      }
    );

    log(`${this.title}: Dispatching event to Google Analytics`, payload);

    (<any>global).dispatchEvent(customEvent);
  }

  private handler(event: Event) {
    if (!(<any>event).detail.category || !(<any>event).detail.action) {
      throw 'Event Tracking requires category and action';
    }

    const { category, action, label, value } = (<any>event).detail;

    const urlParams = {
      ...this.defaultParams(),
      ec: category.trim(),
      ea: action.trim()
    };

    if (label && label.trim().length) {
      urlParams['el'] = label.trim();
    }

    if (value && value.trim().length) {
      urlParams['ev'] = value.trim();
    }

    if (this.options.cacheBuster) {
      urlParams['z'] = Date.now();
    }

    this.sendEvent(urlParams);
  }

  private commandListener() {
    const filteredCommands: string[] = this.getCommands();

    filteredCommands.map(command => {
      log(`${this.title}: Adding event listener for command:`, command);

      (<any>global).addEventListener(command, () => {
        this.event({
          category: this.options.commandCategory,
          action: command
        });
      });
    });
  }

  private async sendEvent(urlParams) {
    const urlParamsEncoded = queryString.stringify(urlParams);
    const requestURL = `https://www.google-analytics.com/collect?${urlParamsEncoded}`;

    log(`${this.title}: Sending request to ${requestURL}`);

    if (this.options.dryRun !== true) {
      const response = await (<any>global).fetch(requestURL, {
        method: 'POST'
      });
    }
  }

  private defaultParams() {
    return {
      aip: '1',
      cid: this.clientID,
      ds: 'app',
      t: 'event',
      tid: this.trackingID,
      ua: `${atom.getAppName()} v${atom.getVersion()} (${atom.getReleaseChannel()})`,
      v: '1',
      vp: `${atom.getWindowDimensions().width}x${atom.getWindowDimensions().height}`
    };
  }

  private getCommands(): string[] {
    const packageName = this.getPackageName();
    // @ts-ignore
    const registeredCommands: string[] = Object.keys(atom.commands.registeredCommands);

    return registeredCommands.filter(registeredCommand => registeredCommand.startsWith(`${packageName}:`));
  }

  private getMacAddress(): string | void {
    const macAddress = getMAC((error, data) => error ? null : data.toString());

    if (macAddress !== null) log(`${this.title}: Detected MAC address '${macAddress}'`);

    return macAddress;
  }

  private getClientID(): string {
    const macAddress = this.getMacAddress();

    const clientID: string = macAddress
      ? createHash('sha1')
        .update(macAddress, 'utf8')
        .digest('hex')
        .toString()

      : uuid();

    if (macAddress) {
      log(`${this.title}: Created client ID '${clientID}' from MAC address`);
    } else {
      log(`${this.title}: Created client ID '${clientID}' from UUID`);
    }

    return clientID;
  }

  private getPackageName(): string {
    const callerPath: string = callerCallsite().getFileName();
    const packageDirPaths: string[] = atom.packages.getPackageDirPaths();

    const intersection: string[] = packageDirPaths.filter(packageDirPath => {
      return callerPath.startsWith(packageDirPath);
    });

    if (intersection?.length) {
      return callerPath
        .replace(intersection[0], '')
        .split(sep)
        .filter(fragment => fragment)[0] || '';
    }
  }
}

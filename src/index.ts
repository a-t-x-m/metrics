'use strict';

import { log } from '@atxm/developer-console';
import { mac } from 'address';
import { promisify } from 'util';
import { sep as pathSeparator } from 'path';
import { v4 as uuidv4, v5 as uuidv5} from 'uuid';
import callerCallsite from 'caller-callsite';
import ipRegex from 'ip-regex';
import queryString from 'query-string';

const getMAC = promisify(mac);

const title = '@atxm/metrics';

const Metrics = ({
  clientID: '',
  trackingID: '',
  options: {
    commandTracking: true,
    commandCategory: 'Package Command',
    ipOverride: false
  },
  init(trackingID: string, options: MetricsOptions = {}): Promise<void> {
    this.options = { ...this.options, ...options };

    if (this.options.consentSetting?.length && atom.config.get(this.options.consentSetting) !== true) {
      log(`${title}: No consent given by the user, aborting tracking`);
      return;
    }

    if (atom.inDevMode() && this.options.trackDevMode !== true) {
      log(`${title}: Tracking has not been enabled for Developer Mode, aborting`);
      return;
    }

    if (atom.inSpecMode() && !this.options.trackSpecMode !== true) {
      log(`${title}: Tracking has not been enabled for Spec Mode, aborting`);
      return;
    }

    this.trackingID = trackingID;

    if (!this.options.muted) {
      this.listen();
    }

    if (this.options.commandTracking) {
      this.commandListener();
    }
  },
  listen(): void {
    log(`${title}: Adding event listener`);

    window.addEventListener(title, this.handler.bind(this));
  },
  mute(): void {
    log(`${title}: Removing event listener`);

    window.removeEventListener(title, this.handler.bind(this));
  },
  event(payload: GoogleEvent): void {
    const customEvent = new CustomEvent(
      title,
      {
        detail: payload
      }
    );

    log(`${title}: Dispatching event`, payload);

    window.dispatchEvent(customEvent);
  },
  async handler({ detail }: unknown): Promise<void> {
    if (!detail.category || !detail.action) {
      throw 'Event Tracking requires category and action';
    }

    const { category, action, label, value } = detail;
    const defaultParams = await this.defaultParams();

    const urlParams = {
      ...defaultParams,
      ec: category.trim(),
      ea: action.trim()
    };

    if (label && label.trim().length) {
      urlParams['el'] = label.trim();
    }

    if (value && value.trim().length) {
      urlParams['ev'] = value.trim();
    }

    if (this.options.ipOverride) {
      urlParams['uip'] = this.getIP();
    }

    if (this.options.cacheBuster) {
      urlParams['z'] = Date.now();
    }

    this.sendEvent(Object.freeze(urlParams));
  },
  commandListener(): void {
    const filteredCommands: string[] = this.getCommands();

    filteredCommands.map(command => {
      log(`${title}: Adding event listener for command:`, command);

      window.addEventListener(command, () => {
        this.event({
          category: this.options.commandCategory,
          action: command
        });
      });
    });
  },
  async sendEvent(urlParams: GoogleUrlParams): Promise<void> {
    const urlParamsEncoded = queryString.stringify(urlParams);
    const requestURL = `https://www.google-analytics.com/collect?${urlParamsEncoded}`;

    log(`${title}: Sending request to ${requestURL}`);

    if (this.options.dryRun !== true) {
      await window.fetch(requestURL, {
        method: 'POST'
      });
    }
  },
  async defaultParams(): Promise<GoogleUrlParams> {
    if (!this.clientID.length) {
      this.clientID = await this.getClientID();
    }

    return Object.freeze({
      aip: '1',
      cid: this.clientID,
      ds: 'app',
      t: 'event',
      tid: this.trackingID,
      ua: `${atom.getAppName()} v${atom.getVersion()} (${atom.getReleaseChannel()})`,
      v: '1',
      vp: `${atom.getWindowDimensions().width}x${atom.getWindowDimensions().height}`
    });
  },
  getCommands(): string[] {
    const packageName = this.getPackageName();
    // @ts-ignore
    const registeredCommands: string[] = Object.keys(atom.commands.registeredCommands);

    return registeredCommands.filter(registeredCommand => registeredCommand.startsWith(`${packageName}:`));
  },
  async getClientID(): Promise<string> {
    const macAddress = await getMAC() || null;

    const clientID: string = macAddress
      ? uuidv5(macAddress, this.getNamespace())
      : uuidv4();

    if (macAddress) {
      log(`${title}: Created client ID '${clientID}' from MAC address`);
    } else {
      log(`${title}: Created client ID '${clientID}' from UUID`);
    }

    return clientID;
  },
  getIP(): string {
    return ipRegex({exact: true}).test(this.options.ipOverride) || ipRegex.v6({exact: true}).test(this.options.ipOverride)
      ? this.options.ipOverride
      : '127.0.0.1';
  },
  getNamespace(): string {
    return uuidv5('https://www.npmjs.com/package/@atxm/metrics', uuidv5.URL);
  },
  getPackageName(): string {
    const callerPath: string = callerCallsite().getFileName();
    const packageDirPaths: string[] = atom.packages.getPackageDirPaths();

    const intersection: string[] = packageDirPaths.filter(packageDirPath => {
      return callerPath.startsWith(packageDirPath);
    });

    if (intersection?.length) {
      return callerPath
        .replace(intersection[0], '')
        .split(pathSeparator)
        .filter(fragment => fragment)[0] || '';
    }
  }
});

export default Metrics;
export { Metrics };

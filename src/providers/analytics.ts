import { log } from '@atxm/developer-console';
import { uuidFromString } from '../shared';

import {
  addCommandListener,
  addConfigurationListener,
  dispatchEvent,
  getClientID,
  getIP,
  getUserAgent,
  getWindowDimensions,
  isValidConfig,
  postRequest,
  title
} from '../shared'

const eventName = uuidFromString(`${title}:GoogleAnalytics`);

const Analytics = ({
  clientID: '',
  trackingID: '',
  trackerURL: 'https://www.google-analytics.com/collect',
  options: {
    categories: {
      commands: 'Atom Commands',
      configuration: 'Atom Configuration'
    },
    tracking: {
      commands: true,
      configuration: true
    },

    // Anonymization Options
    ipOverride: false,
    randomClientID: false
  },

  async init(trackingID: string, options: MetricsOptions = {}): Promise<void> {
    this.options = {
      ...this.options,
      ...options,
      categories: {
        ...this.options.categories,
        ...options.categories,
      },
      tracking: {
        ...this.options.tracking,
        ...options.tracking,
      }
    };

    if (!isValidConfig(this.options)) {
      return;
    }

    this.trackingID = trackingID;

    if (!this.options.muted) {
      this.listen();
    }

    if (this.options.tracking['commands']) {
      await addCommandListener(eventName, this.options);
    }

    if (this.options.tracking['configuration']) {
      await addConfigurationListener(eventName, this.options);
    }
  },

  listen(): void {
    log(`${title}: Adding event listener`);

    window.addEventListener(eventName, this.handler.bind(this));
  },

  mute(): void {
    log(`${title}: Removing event listener`);

    window.removeEventListener(eventName, this.handler.bind(this));
  },

  async handler({ detail }: unknown): Promise<void> {
    if (!detail.category || !detail.action) {
      throw 'Event Tracking requires category and action';
    }

    const { category, action, label, value } = detail;
    const defaultParams = await this.defaultParams();

    const urlParams: GoogleUrlParams = {
      ...defaultParams,
      ec: category.trim(),
      ea: action.trim()
    };

    if (label?.trim().length) {
      urlParams['el'] = label.trim();
    }

    if (value?.trim().length) {
      urlParams['ev'] = value.trim();
    }

    if (this.options.ipOverride) {
      urlParams['uip'] = getIP(this.options);
    }

    if (this.options.cacheBuster) {
      urlParams['z'] = Date.now();
    }

    postRequest(
      this.trackerURL,
      Object.freeze(urlParams),
      this.options.dryRun
    );
  },

  async defaultParams(): Promise<GoogleUrlParams> {
    if (!this.clientID.length) {
      this.clientID = await getClientID(this.randomClientID);
    }

    return Object.freeze({
      aip: 1,
      cid: this.clientID,
      ds: 'app',
      t: 'event',
      tid: this.trackingID,
      ua: getUserAgent(),
      v: 1,
      vp: getWindowDimensions()
    });
  },

  dispatchEvent(payload: MetricsEvent): void {
    dispatchEvent(eventName, payload)
  }
});

export {
  Analytics
};

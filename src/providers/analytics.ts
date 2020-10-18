import { log } from '@atxm/developer-console';

import {
  addCommandListener,
  dispatchEvent,
  getClientID,
  getIP,
  isValidConfig,
  post,
  title
} from '../shared'

const GA = ({
  clientID: '',
  trackingID: '',
  options: {
    commandTracking: true,
    commandCategory: 'Package Command',
    ipOverride: false
  },
  postURL: 'https://www.google-analytics.com/collect',

  async init(trackingID: string, options: MetricsOptions = {}): Promise<void> {
    this.options = { ...this.options, ...options };

    if (!isValidConfig(this.options)) {
      return;
    }

    this.trackingID = trackingID;

    if (!this.options.muted) {
      this.listen();
    }

    if (this.options.commandTracking) {
      await addCommandListener(this.options);
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
      urlParams['uip'] = getIP(this.options);
    }

    if (this.options.cacheBuster) {
      urlParams['z'] = Date.now();
    }

    post(
      this.postURL,
      Object.freeze(urlParams),
      this.options.dryRun
    );
  },

  async defaultParams(): Promise<GoogleUrlParams> {
    if (!this.clientID.length) {
      this.clientID = await getClientID();
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

  dispatchEvent(payload: GoogleEvent): void {
    dispatchEvent(payload)
  }
});

export {
  GA
};

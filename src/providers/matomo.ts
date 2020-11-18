import { log } from '@atxm/developer-console';

import {
  addCommandListener,
  dispatchEvent,
  getClientID,
  getShortHash,
  getUserAgent,
  getWindowDimensions,
  isValidConfig,
  post,
  title
} from '../shared'

const eventName = `${title}:Matomo`;

const Matomo = ({
  clientID: '',
  trackingID: '',
  trackerURL: '',
  options: {
    commandTracking: true,
    commandCategory: 'Package Command',
    ipOverride: false
  },

  async init(trackerURL: string, trackingID: string | number = 1, options: MetricsOptions = {}): Promise<void> {
    this.options = { ...this.options, ...options };

    if (!isValidConfig(this.options)) {
      return;
    }

    this.trackerURL = trackerURL;
    this.trackingID = String(trackingID);

    if (!this.options.muted) {
      this.listen();
    }

    if (this.options.commandTracking) {
      await addCommandListener(eventName, this.options);
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

    const urlParams = {
      ...defaultParams,
      e_c: category.trim(),
      e_a: action.trim()
    };

    if (label && label.trim().length) {
      urlParams['e_n'] = label.trim();
    }

    if (value && value.trim().length) {
      urlParams['e_v'] = value.trim();
    }

    post(
      this.trackerURL,
      Object.freeze(urlParams),
      this.options.dryRun
    );
  },

  async defaultParams(): Promise<MatomoUrlParams> {
    if (!this.clientID.length) {
      this.clientID = await getShortHash(await getClientID());
    }

    return Object.freeze({
      _id: this.clientID,
      apiv: 1,
      idsite: this.trackingID,
      rec: 1,
      res: getWindowDimensions(),
      ua: getUserAgent()
    });
  },

  dispatchEvent(payload: MetricsEvent): void {
    dispatchEvent(eventName, payload)
  }
});

export {
  Matomo
};

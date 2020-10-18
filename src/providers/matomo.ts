import { log } from '@atxm/developer-console';
import hasha from 'hasha';

import {
  addCommandListener,
  dispatchEvent,
  getClientID,
  getUserAgent,
  getWindowDimensions,
  isValidConfig,
  post,
  title
} from '../shared'

const Matomo = ({
  clientID: '',
  trackingID: '',
  trackerURL: '',
  options: {
    commandTracking: true,
    commandCategory: 'Package Command',
    ipOverride: false
  },

  async init(trackingID: string, trackerURL: string, options: MetricsOptions = {}): Promise<void> {
    this.options = { ...this.options, ...options };

    if (!isValidConfig(this.options)) {
      return;
    }

    this.trackingID = trackingID;
    this.trackerURL = trackerURL;

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
      this.clientID = hasha(await getClientID(), {
        algorithm: 'sha256'
      }).substring(0, 16);
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
    dispatchEvent(payload)
  }
});

export {
  Matomo
};

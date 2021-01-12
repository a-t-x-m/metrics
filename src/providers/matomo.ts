import { log } from '@atxm/developer-console';
import { v4 as uuidV4 } from 'uuid';

import {
  addCommandListener,
  addConfigurationListener,
  emit,
  getClientID,
  getShortHash,
  getUserAgent,
  getWindowDimensions,
  isValidConfig,
  postRequest,
  title
} from '../shared'

const eventName = `${title}/Matomo:${getShortHash()}`;

const Matomo = ({
  clientID: '',
  trackingID: '',
  trackerURL: '',
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
    randomClientID: false
  },

  async init(trackerURL: string, trackingID: string | number = 1, options: MetricsOptions = {}): Promise<void> {
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

    this.trackerURL = trackerURL;
    this.trackingID = String(trackingID);

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

    const urlParams = {
      ...defaultParams,
      e_c: category.trim(),
      e_a: action.trim()
    };

    if (label?.trim().length) {
      urlParams['e_n'] = label.trim();
    }

    if (value?.trim().length) {
      urlParams['e_v'] = value.trim();
    }

    if (this.options.cacheBuster) {
      urlParams['rand'] = uuidV4();
    }

    postRequest(
      this.trackerURL,
      Object.freeze(urlParams),
      this.options.dryRun
    );
  },

  async defaultParams(): Promise<MatomoUrlParams> {
    if (!this.clientID.length) {
      this.clientID = await getShortHash(await getClientID(this.randomClientID));
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

  emit(payload: MetricsEvent): void {
    emit(eventName, payload)
  }
});

export {
  Matomo
};

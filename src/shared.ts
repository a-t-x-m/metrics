import { log } from '@atxm/developer-console';
import { mac } from 'address';
import { promisify } from 'util';
import { sep as pathSeparator } from 'path';
import { v4 as uuidV4, v5 as uuidV5} from 'uuid';
import callerCallsite from 'caller-callsite';
import dotObject from 'dot-object';
import hasha from 'hasha';
import ipRegex from 'ip-regex';
import queryString from 'query-string';

const getMAC = promisify(mac);
const title = '@atxm/metrics';

async function addCommandListener(eventName: string, options: MetricsOptions): Promise<void> {
  const filteredCommands: string[] = await getCommands();

  atom.commands.onDidDispatch(event => {
    const command = event.type;

    if (filteredCommands.includes(command)) {
      emit(eventName, {
        category: options.categories['commands'],
        action: command
      });
    }
  });
}

async function addConfigurationListener(eventName: string, options: MetricsOptions): Promise<void> {
  const packageName = await getPackageName();
  const configuration: string[] = await getConfiguration();

  configuration.map(configKey => {
    const configName = `${packageName}.${configKey}`;

    atom.config.onDidChange(configName, ({newValue}) => {
      const configSchema: unknown = atom.config.getSchema(configName);

      if (configSchema['type'] && (configSchema['type'] === 'string' || configSchema['type'] === 'array')) {
        return;
      }

      emit(eventName, {
        category: options.categories['configuration'],
        action: configName,
        value: String(newValue)
      });
    });
  });
}

function emit(eventName: string, payload: MetricsEvent): void {
  const customEvent = new CustomEvent(
    eventName,
    {
      detail: payload
    }
  );

  log(`${title}: Dispatching event`, payload);

  window.dispatchEvent(customEvent);
}

function dispatchEvent(eventName: string, payload: MetricsEvent): void {
  console.warn('dispatchEvent() has been deprecated in favour of emit() and will be removed in the near future');

  emit(eventName, payload);
}

async function getClientID(randomID = false): Promise<string> {
  const macAddress = randomID
    ? null
    : await getMAC() || null;

  const clientID: string = macAddress
    ? uuidFromString(macAddress)
    : uuidV4();

  if (macAddress) {
    log(`${title}: Created client ID '${clientID}' from MAC address`);
  } else {
    log(`${title}: Created client ID '${clientID}' from UUID`);
  }

  return clientID;
}

async function getCommands(): Promise<string[]> {
  const packageName = await getPackageName();
  // @ts-ignore
  const registeredCommands: string[] = Object.keys(atom.commands.registeredCommands);

  return registeredCommands.filter(registeredCommand => packageName && registeredCommand.startsWith(`${packageName}:`));
}

function getIP(options: MetricsOptions): string {
  {
    const ipRegexOptions = {
      exact: true
    };

    return ipRegex(ipRegexOptions).test(options.ipOverride) || ipRegex.v6(ipRegexOptions).test(options.ipOverride)
      ? options.ipOverride
      : '127.0.0.1';
  }
}

async function getConfiguration(): Promise<string[]> {
  const packageName = await getPackageName();
  const config = atom.config.get(packageName);

  dotObject.keepArray = true;

  return Object.keys(dotObject.dot(config)) || [];
}

function getNamespace(): string {
  return uuidFromString('https://www.npmjs.com/package/@atxm/metrics');
}

async function getPackageName(): Promise<string> {
  const callerPath: string = callerCallsite().getFileName();
  const packageDirPaths: string[] = atom.packages.getPackageDirPaths();

  const intersection: string[] = packageDirPaths.filter(packageDirPath => {
    return callerPath.startsWith(packageDirPath);
  });

  if (intersection?.length) {
    return callerPath
      .replace(intersection[0], '')
      .split(pathSeparator)
      .filter(fragment => fragment)[0] || 'pkg.' + await getShortHash(__filename, { length: 8 });
  }

  return 'pkg.' + await getShortHash(__filename, { length: 8 });
}

async function getShortHash(inputString = '', userOptions: ShortHashOptions = {}): Promise<string> {
  const options = {
    algorithm: 'sha256',
    length: 16,
    ...userOptions
  };

  inputString = inputString?.length && typeof inputString === 'string'
    ? inputString
    : uuidV4();

  return (await hasha.async(inputString, {
    algorithm: options.algorithm
  })).substring(0, options.length);
}

function getUserAgent(): string {
  return `${atom.getAppName()} v${atom.getVersion()} (${atom.getReleaseChannel()})`;
}

function getWindowDimensions(): string {
  return `${atom.getWindowDimensions().width}x${atom.getWindowDimensions().height}`;
}

function isValidConfig(options: MetricsOptions): boolean {
  if (options.consentSetting?.length && atom.config.get(options.consentSetting) !== true) {
    log(`${title}: No consent given by the user, aborting tracking`);
    return false;
  }

  if (atom.inDevMode() && options.trackInDevMode !== true) {
    log(`${title}: Tracking has not been enabled for Developer Mode, aborting`);
    return false;
  }

  if (atom.inSpecMode() && !options.trackInSpecMode !== true) {
    log(`${title}: Tracking has not been enabled for Spec Mode, aborting`);
    return false;
  }

  return true;
}

async function postRequest(baseURL: string, urlParams: GoogleUrlParams | MatomoUrlParams, dryRun = false): Promise<void> {
  const urlParamsEncoded = queryString.stringify(urlParams);
  const requestURL = `${baseURL}?${urlParamsEncoded}`;

  log(`${title}: Sending post request to ${requestURL}`);

  if (dryRun) return;

  if (navigator.sendBeacon) {
    const returnValue = navigator.sendBeacon(requestURL);

    log(`${title}: sendBeacon`, returnValue ? 'succeeded' : 'failed');
  } else {
    const response = await window.fetch(requestURL, {
      method: 'POST',
      keepalive: true
    });

    log(`${title}: Fetch response`, response);
  }
}

function uuidFromString(inputString: string): string {
  return uuidV5(inputString, getNamespace());
}

export {
  addCommandListener,
  addConfigurationListener,
  dispatchEvent,
  emit,
  getClientID,
  getCommands,
  getConfiguration,
  getIP,
  getNamespace,
  getPackageName,
  getShortHash,
  getUserAgent,
  uuidFromString,
  getWindowDimensions,
  isValidConfig,
  postRequest,
  title
};

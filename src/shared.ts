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

async function addCommandListener(options: MetricsOptions): Promise<void> {
  const filteredCommands: string[] = await getCommands();

  atom.commands.onDidDispatch(event => {
    const command = event.type;

    if (filteredCommands.includes(command)) {
      dispatchEvent({
        category: options.commandCategory,
        action: command
      });
    }
  });
}

function dispatchEvent(payload: GoogleEvent): void {
  const customEvent = new CustomEvent(
    title,
    {
      detail: payload
    }
  );

  log(`${title}: Dispatching event`, payload);

  window.dispatchEvent(customEvent);
}

async function getClientID(): Promise<string> {
  const macAddress = await getMAC() || null;

  const clientID: string = macAddress
    ? uuidv5(macAddress, getNamespace())
    : uuidv4();

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

function getNamespace(): string {
  return uuidv5('https://www.npmjs.com/package/@atxm/metrics', uuidv5.URL);
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
      .filter(fragment => fragment)[0];
  }

  return uuidv4();
}

function isValidConfig(options: MetricsOptions): boolean {
  if (options.consentSetting?.length && atom.config.get(options.consentSetting) !== true) {
    log(`${title}: No consent given by the user, aborting tracking`);
    return false;
  }

  if (atom.inDevMode() && options.trackDevMode !== true) {
    log(`${title}: Tracking has not been enabled for Developer Mode, aborting`);
    return false;
  }

  if (atom.inSpecMode() && !options.trackSpecMode !== true) {
    log(`${title}: Tracking has not been enabled for Spec Mode, aborting`);
    return false;
  }

  return true;
}

async function post(baseURL: string, urlParams: GoogleUrlParams, dryRun = false): Promise<void> {
  const urlParamsEncoded = queryString.stringify(urlParams);
  const requestURL = `${baseURL}?${urlParamsEncoded}`;

  log(`${title}: Sending post request to ${requestURL}`);

  if (dryRun !== true) {
    await window.fetch(requestURL, {
      method: 'POST'
    });
  }
}

export {
  addCommandListener,
  dispatchEvent,
  getClientID,
  getCommands,
  getIP,
  getNamespace,
  getPackageName,
  isValidConfig,
  post,
  title
};

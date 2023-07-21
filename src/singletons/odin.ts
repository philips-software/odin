import { version } from '../common/version.js';
import { Odin } from '../stores/odin.js';
import { logger } from './logger.js';

declare global {
  // eslint-disable-next-line no-var
  var odin: Odin | undefined;
}

function createOdin(): Odin {
  if ('odin' in globalThis) {
    const odin = globalThis.odin;

    if (odin instanceof Odin) {
      if (odin.version !== version) {
        throw new Error(logger.createMessage(
          `Failed to acquire Odin instance for version ${String(version)}.`,
          `Another Odin instance was previously created with version ${String(odin.version)}.`,
          `There should only be one version in your bundle.`,
        ));
      }
      return odin;
    }
  }

  const odin = new Odin();
  globalThis.odin = odin;

  return odin;
}

const odin = createOdin();

export {
  odin,
};

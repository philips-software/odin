import { beforeEach, describe, expect, test, vi } from 'vitest';

import { version } from '../src/common/version.js';

describe('reuse', () => {

  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  test('should create', async () => {
    const { Odin } = await import('../src/stores/odin.js');
    const { odin } = await import('../src/singletons/odin.js');

    expect(odin).toBeInstanceOf(Odin);

    expect(globalThis.odin).toBeInstanceOf(Odin);
    expect(globalThis.odin).toStrictEqual(odin);
  });

  test('should reuse', async () => {
    const { Odin } = await import('../src/stores/odin.js');

    const fixtureOdin = new Odin();
    vi.stubGlobal('odin', fixtureOdin);

    const { odin } = await import('../src/singletons/odin.js');

    expect(odin).toBeInstanceOf(Odin);
    expect(odin).toStrictEqual(fixtureOdin);

    expect(globalThis.odin).toBeInstanceOf(Odin);
    expect(globalThis.odin).toStrictEqual(fixtureOdin);
  });

  test('should throw error when reusing a different version', async () => {
    const { Odin } = await import('../src/stores/odin.js');

    const fixtureOdin = new Odin();
    const fixtureVersion = 'version';

    Object.defineProperty(fixtureOdin, 'version', { get: () => fixtureVersion });
    expect(fixtureOdin.version).toBe(fixtureVersion);

    vi.stubGlobal('odin', fixtureOdin);

    await expect(import('../src/singletons/odin.js')).rejects.toThrow([
      `[odin]: Failed to acquire Odin instance for version ${version}.`,
      `Another Odin instance was previously created with version ${fixtureVersion}.`,
      `There should only be one version in your bundle.`,
    ].join(' '));
  });

});

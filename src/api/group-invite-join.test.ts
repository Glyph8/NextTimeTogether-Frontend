import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import { webcrypto } from "node:crypto";

import { clientBaseApi } from ".";
import { getInviteEncNewMemberIdWithLookupFallback } from "./group-invite-join";

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

type InviteGroup1Fn = typeof clientBaseApi.api.inviteGroup1;

const originalInviteGroup1 = clientBaseApi.api.inviteGroup1;
const originalConsoleInfo = console.info;
const originalCrypto = globalThis.crypto;
const originalWindow = globalThis.window;
const originalLocalStorage = globalThis.localStorage;
const originalGroupLookupEnabled = process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED;
const originalGroupLookupDual = process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST;

let metricLogs: unknown[][] = [];

const makeHttpError = (status: number, code = "ERR") => ({
  response: {
    status,
    data: { code },
  },
});

const getMetricEvents = () =>
  metricLogs
    .filter((entry) => entry[0] === "[LookupMetric]")
    .map((entry) => entry[1] as string);

const mockInviteGroup1 = (impl: InviteGroup1Fn) => {
  (clientBaseApi.api as { inviteGroup1: InviteGroup1Fn }).inviteGroup1 = impl;
};

beforeEach(() => {
  globalThis.crypto = webcrypto as Crypto;
  Object.defineProperty(globalThis, "window", {
    value: globalThis,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });

  localStorage.setItem("hashed_user_id_for_manager", "user@test.com");
  localStorage.setItem("pseudo_id_index_key", "index-key");

  process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED = "true";
  process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST = "true";

  metricLogs = [];
  console.info = (...args: unknown[]) => {
    metricLogs.push(args);
  };
});

afterEach(() => {
  (clientBaseApi.api as { inviteGroup1: InviteGroup1Fn }).inviteGroup1 = originalInviteGroup1;
  console.info = originalConsoleInfo;

  if (originalCrypto === undefined) {
    delete (globalThis as { crypto?: Crypto }).crypto;
  } else {
    globalThis.crypto = originalCrypto;
  }

  if (originalWindow === undefined) {
    delete (globalThis as { window?: Window & typeof globalThis }).window;
  } else {
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
  }

  if (originalLocalStorage === undefined) {
    delete (globalThis as { localStorage?: Storage }).localStorage;
  } else {
    Object.defineProperty(globalThis, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  }

  if (originalGroupLookupEnabled === undefined) {
    delete process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED;
  } else {
    process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED = originalGroupLookupEnabled;
  }
  if (originalGroupLookupDual === undefined) {
    delete process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST;
  } else {
    process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST = originalGroupLookupDual;
  }
});

test("lookup success should return response without fallback", async () => {
  let callCount = 0;
  mockInviteGroup1(async () => {
    callCount += 1;
    return { data: { result: { encencGroupMemberId: "enc-member" } } } as never;
  });

  const result = await getInviteEncNewMemberIdWithLookupFallback({
    groupId: "group-1",
    encGroupId: "legacy-group",
  });

  assert.equal(result?.encencGroupMemberId, "enc-member");
  assert.equal(callCount, 1);
  assert.deepEqual(getMetricEvents(), ["lookup_request", "lookup_success"]);
});

test("lookup 404 should retry with refreshed lookup cache and succeed", async () => {
  let callCount = 0;
  mockInviteGroup1(async () => {
    callCount += 1;
    if (callCount === 1) {
      throw makeHttpError(404, "LOOKUP_NOT_FOUND");
    }
    return { data: { result: { encencGroupMemberId: "enc-member" } } } as never;
  });

  const result = await getInviteEncNewMemberIdWithLookupFallback({
    groupId: "group-404",
    encGroupId: "legacy-group",
  });

  assert.equal(result?.encencGroupMemberId, "enc-member");
  assert.equal(callCount, 2);
});

for (const status of [400, 404, 409] as const) {
  test(`lookup ${status} should fallback to legacy request`, async () => {
    const requests: Array<Record<string, unknown>> = [];
    let callCount = 0;

    mockInviteGroup1(async (payload) => {
      callCount += 1;
      requests.push(payload as Record<string, unknown>);

      if (status === 404) {
        if (callCount <= 2) throw makeHttpError(404, "LOOKUP_NOT_FOUND");
      } else if (callCount === 1) {
        throw makeHttpError(status, `LOOKUP_${status}`);
      }

      return { data: { result: { encencGroupMemberId: "legacy-member" } } } as never;
    });

    const result = await getInviteEncNewMemberIdWithLookupFallback({
      groupId: `group-${status}`,
      encGroupId: "legacy-group",
    });

    const fallbackRequest = requests[requests.length - 1];
    assert.equal(result?.encencGroupMemberId, "legacy-member");
    assert.equal("lookupId" in fallbackRequest, false);
    assert.equal("lookupVersion" in fallbackRequest, false);
    assert.equal(fallbackRequest.encGroupId, "legacy-group");
    assert.ok(getMetricEvents().includes("lookup_fallback_attempt"));
    assert.ok(getMetricEvents().includes("lookup_fallback_success"));
  });
}

test("lookup 5xx should not fallback and should track blocked metric", async () => {
  const requests: Array<Record<string, unknown>> = [];

  mockInviteGroup1(async (payload) => {
    requests.push(payload as Record<string, unknown>);
    throw makeHttpError(500, "INTERNAL_ERROR");
  });

  await assert.rejects(
    getInviteEncNewMemberIdWithLookupFallback({
      groupId: "group-500",
      encGroupId: "legacy-group",
    })
  );

  assert.equal(requests.length, 1);
  assert.equal("lookupId" in requests[0], true);
  assert.equal(getMetricEvents().includes("lookup_fallback_attempt"), false);
  assert.equal(getMetricEvents().includes("lookup_fallback_blocked_server"), true);
});

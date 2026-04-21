import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import { webcrypto } from "node:crypto";

import { clientBaseApi } from ".";
import {
  apiPostGroupMemberSave,
  ensureGroupMemberMappingForInvite,
  getInviteEncNewMemberId,
  getInviteEncNewMemberIdWithLookupFallback,
  GroupInvitePreconditionError,
} from "./group-invite-join";

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
type SaveGroupMemberFn = typeof clientBaseApi.api.saveGroupMember;

const originalInviteGroup1 = clientBaseApi.api.inviteGroup1;
const originalSaveGroupMember = clientBaseApi.api.saveGroupMember;
const originalConsoleInfo = console.info;
const originalCrypto = globalThis.crypto;
const originalWindow = globalThis.window;
const originalLocalStorage = globalThis.localStorage;
const originalGroupLookupEnabled = process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED;

let metricLogs: unknown[][] = [];

const makeHttpError = (status: number, code: string | number = "ERR") => ({
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

const mockSaveGroupMember = (impl: SaveGroupMemberFn) => {
  (clientBaseApi.api as { saveGroupMember: SaveGroupMemberFn }).saveGroupMember = impl;
};

const createAesKey = () =>
  globalThis.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);

beforeEach(() => {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto as Crypto,
    writable: true,
    configurable: true,
  });
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

  metricLogs = [];
  console.info = (...args: unknown[]) => {
    metricLogs.push(args);
  };
});

afterEach(() => {
  (clientBaseApi.api as { inviteGroup1: InviteGroup1Fn }).inviteGroup1 = originalInviteGroup1;
  (clientBaseApi.api as { saveGroupMember: SaveGroupMemberFn }).saveGroupMember =
    originalSaveGroupMember;
  console.info = originalConsoleInfo;

  if (originalCrypto === undefined) {
    delete (globalThis as { crypto?: Crypto }).crypto;
  } else {
    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
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
});

test("invite1 payload missing lookup fields should fail before request", async () => {
  let called = false;
  mockInviteGroup1(async () => {
    called = true;
    return { data: { result: { encencGroupMemberId: "unused" } } } as never;
  });

  await assert.rejects(
    getInviteEncNewMemberId({
      groupId: "group-1",
      encGroupId: "legacy-group",
      lookupId: "",
      lookupVersion: Number.NaN,
    } as never),
    /invite1 payload missing required field\(s\): lookupId/
  );

  assert.equal(called, false);
});

test("lookup 404 retry should keep lookup payload fields", async () => {
  const requests: Array<Record<string, unknown>> = [];
  mockInviteGroup1(async (payload) => {
    requests.push(payload as unknown as Record<string, unknown>);
    if (requests.length === 1) {
      throw makeHttpError(404, "LOOKUP_NOT_FOUND");
    }
    return { data: { result: { encencGroupMemberId: "enc-member" } } } as never;
  });

  const result = await getInviteEncNewMemberIdWithLookupFallback({
    groupId: "group-404",
    encGroupId: "legacy-group",
  });

  assert.equal(result?.encencGroupMemberId, "enc-member");
  assert.equal(requests.length, 2);
  assert.equal(typeof requests[0].lookupId, "string");
  assert.equal(typeof requests[0].lookupVersion, "number");
  assert.equal(requests[0].lookupId, requests[1].lookupId);
  assert.equal(requests[0].lookupVersion, requests[1].lookupVersion);
});

test("mapping precondition should block when encrypted group key is missing", async () => {
  const masterKey = await createAesKey();
  const groupKey = await createAesKey();

  await assert.rejects(
    ensureGroupMemberMappingForInvite({
      groupId: "group-1",
      encGroupId: "enc-group-id",
      encGroupKey: "",
      groupKey,
      masterKey,
    }),
    (error: unknown) => error instanceof GroupInvitePreconditionError
  );
});

test("member/save should fail fast when lookup fields are missing", async () => {
  let saveCalled = false;
  mockSaveGroupMember(async () => {
    saveCalled = true;
    return { data: { message: "ok" } } as never;
  });

  await assert.rejects(
    apiPostGroupMemberSave({
      groupId: "group-1",
      encGroupId: "enc-group-id",
      encGroupKey: "enc-group-key",
      encUserId: "enc-user-id",
      encencGroupMemberId: "enc-enc-group-member-id",
    } as never),
    /member\/save payload missing required field\(s\): lookupId, lookupVersion/
  );

  assert.equal(saveCalled, false);
});

test("mapping sync success then invite1 success path", async () => {
  const saveRequests: Array<Record<string, unknown>> = [];
  const inviteRequests: Array<Record<string, unknown>> = [];

  mockSaveGroupMember(async (payload) => {
    saveRequests.push(payload as unknown as Record<string, unknown>);
    return { data: { message: "ok" } } as never;
  });

  mockInviteGroup1(async (payload) => {
    inviteRequests.push(payload as unknown as Record<string, unknown>);
    return { data: { result: { encencGroupMemberId: "enc-member" } } } as never;
  });

  const masterKey = await createAesKey();
  const groupKey = await createAesKey();

  await ensureGroupMemberMappingForInvite({
    groupId: "group-integration",
    encGroupId: "enc-group-id",
    encGroupKey: "enc-group-key",
    groupKey,
    masterKey,
  });

  const result = await getInviteEncNewMemberIdWithLookupFallback({
    groupId: "group-integration",
    encGroupId: "enc-group-id",
  });

  assert.equal(result?.encencGroupMemberId, "enc-member");
  assert.equal(saveRequests.length, 1);
  assert.equal(saveRequests[0].groupId, "group-integration");
  assert.equal(typeof saveRequests[0].lookupId, "string");
  assert.equal(typeof saveRequests[0].lookupVersion, "number");
  assert.equal(inviteRequests.length, 1);
  assert.equal(typeof inviteRequests[0].lookupId, "string");
  assert.equal(typeof inviteRequests[0].lookupVersion, "number");
  assert.deepEqual(getMetricEvents(), ["lookup_request", "lookup_success"]);
});

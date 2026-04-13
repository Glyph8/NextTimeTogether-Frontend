import assert from "node:assert/strict";
import test from "node:test";
import {
  makeLookupId,
  maskLookupId,
  PROMISE_LOOKUP_VERSION,
  shouldSendLegacyEncUserId,
} from "./promise-lookup";

test("same input should produce same lookupId", async () => {
  const first = await makeLookupId("User@Test.com ", " index-key ", PROMISE_LOOKUP_VERSION);
  const second = await makeLookupId("user@test.com", "index-key", PROMISE_LOOKUP_VERSION);

  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
});

test("different input or version should produce different lookupId", async () => {
  const base = await makeLookupId("user@test.com", "index-key", 1);
  const changedUser = await makeLookupId("other@test.com", "index-key", 1);
  const changedVersion = await makeLookupId("user@test.com", "index-key", 2);

  assert.notEqual(base, changedUser);
  assert.notEqual(base, changedVersion);
});

test("maskLookupId should not expose full lookupId", () => {
  assert.equal(maskLookupId(""), "");
  assert.equal(maskLookupId("1234567890"), "1234***");
  assert.equal(
    maskLookupId("1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"),
    "12345678...cdef"
  );
});

test("shouldSendLegacyEncUserId should follow env switch", () => {
  const original = process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST;

  process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST = "false";
  assert.equal(shouldSendLegacyEncUserId(), false);

  process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST = "true";
  assert.equal(shouldSendLegacyEncUserId(), true);

  if (original === undefined) {
    delete process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST;
  } else {
    process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST = original;
  }
});

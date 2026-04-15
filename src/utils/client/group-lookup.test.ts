import assert from "node:assert/strict";
import test from "node:test";
import {
  GROUP_LOOKUP_VERSION,
  makeGroupLookupId,
  maskLookupId,
  shouldSendLegacyEncGroupId,
  shouldUseGroupLookup,
} from "./group-lookup";

test("same user/group input should produce same group lookupId", async () => {
  const first = await makeGroupLookupId(
    "User@Test.com ",
    " group-123 ",
    " index-key ",
    GROUP_LOOKUP_VERSION
  );
  const second = await makeGroupLookupId(
    "user@test.com",
    "group-123",
    "index-key",
    GROUP_LOOKUP_VERSION
  );

  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
});

test("different group or version should produce different group lookupId", async () => {
  const base = await makeGroupLookupId("user@test.com", "group-123", "index-key", 1);
  const changedGroup = await makeGroupLookupId("user@test.com", "group-456", "index-key", 1);
  const changedVersion = await makeGroupLookupId("user@test.com", "group-123", "index-key", 2);

  assert.notEqual(base, changedGroup);
  assert.notEqual(base, changedVersion);
});

test("group lookup feature flags should follow env switch", () => {
  const originalEnabled = process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED;
  const originalDual = process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST;

  try {
    process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED = "false";
    process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST = "false";
    assert.equal(shouldUseGroupLookup(), false);
    assert.equal(shouldSendLegacyEncGroupId(), false);

    process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED = "true";
    process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST = "true";
    assert.equal(shouldUseGroupLookup(), true);
    assert.equal(shouldSendLegacyEncGroupId(), true);
  } finally {
    if (originalEnabled === undefined) {
      delete process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED;
    } else {
      process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED = originalEnabled;
    }

    if (originalDual === undefined) {
      delete process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST;
    } else {
      process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST = originalDual;
    }
  }
});

test("maskLookupId should not expose full id", () => {
  assert.equal(maskLookupId(""), "");
  assert.equal(maskLookupId("1234567890"), "1234***");
  assert.equal(
    maskLookupId("1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"),
    "12345678...cdef"
  );
});

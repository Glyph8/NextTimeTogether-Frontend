import assert from "node:assert/strict";
import test from "node:test";
import { makeLookupId, PROMISE_LOOKUP_VERSION } from "./promise-lookup";

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

import { GetPromiseRequest } from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";
import {
  buildPromiseLookupRequest,
  maskLookupId,
  resolveLookupContext,
  shouldSendLegacyEncUserId,
} from "@/utils/client/promise-lookup";
import {
  getLookupHttpStatus,
  getLookupServerCode,
  isLookupTransitionError,
} from "./lookup-error";
import { trackLookupMetric } from "./lookup-metrics";

const PROMISE_KEY_EXPECTED_ERROR_STATUSES = [400, 403, 404];

export interface EncPromiseIdList {
  encPromiseIdList: string[];
}

/** /promise/promisekey1 promise_proxy_user 테이블에 있는 enc_promise_id (개인키로 암호화한 promise_id) 리스트 반환 */
export const getEncPromiseId = () => {
  return clientBaseApi.promise
    .getPromiseKey1()
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<EncPromiseIdList>;
      return realData.result || [];
    })
    .catch(handleApiError);
};

export interface EncPromiseKey {
  encPromiseKey: string;
}

/** /promise/promisekey2 전달한 promiseId의 개인키로 암호화된 promiseKey 반환 */
export const getEncPromiseKey = (data: GetPromiseRequest) => {
  trackLookupMetric("lookup_request", {
    domain: "promise",
    route: "/promise/promisekey2",
    lookupVersion: data.lookupVersion,
  });

  return clientBaseApi.promise
    .getPromiseKey2(data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<EncPromiseKey>;
      trackLookupMetric("lookup_success", {
        domain: "promise",
        route: "/promise/promisekey2",
        lookupVersion: data.lookupVersion,
      });
      return realData.result || [];
    })
    .catch((error) => {
      const status = getLookupHttpStatus(error);
      const isExpected =
        typeof status === "number" &&
        PROMISE_KEY_EXPECTED_ERROR_STATUSES.includes(status);

      if (isExpected) {
        trackLookupMetric("lookup_failure", {
          domain: "promise",
          route: "/promise/promisekey2",
          lookupVersion: data.lookupVersion,
          status,
          serverCode: getLookupServerCode(error),
        });
        console.warn("promisekey2 요청 실패", {
          status,
          promiseId: data.promiseId,
          lookupVersion: data.lookupVersion,
          lookupId: maskLookupId(data.lookupId),
        });
        throw error;
      }
      return handleApiError(error);
    });
};

interface GetEncPromiseKeyWithFallbackInput {
  promiseId: string;
  getLegacyEncUserId?: () => Promise<string>;
}

export const getEncPromiseKeyWithLookupFallback = async ({
  promiseId,
  getLegacyEncUserId,
}: GetEncPromiseKeyWithFallbackInput) => {
  const lookup = await resolveLookupContext();
  const legacyProvider = getLegacyEncUserId;

  try {
    const request = buildPromiseLookupRequest(promiseId, lookup);
    return await getEncPromiseKey(request);
  } catch (error) {
    const fallbackAllowed =
      shouldSendLegacyEncUserId() && typeof legacyProvider === "function";
    if (!fallbackAllowed || !isLookupTransitionError(error)) {
      throw error;
    }

    trackLookupMetric("lookup_fallback_attempt", {
      domain: "promise",
      route: "/promise/promisekey2",
      lookupVersion: lookup.lookupVersion,
      status: getLookupHttpStatus(error),
      serverCode: getLookupServerCode(error),
    });

    const legacyEncUserId = await legacyProvider();
    if (!legacyEncUserId) {
      throw error;
    }
    const fallbackRequest = buildPromiseLookupRequest(
      promiseId,
      lookup,
      legacyEncUserId
    );

    try {
      const response = await getEncPromiseKey(fallbackRequest);
      trackLookupMetric("lookup_fallback_success", {
        domain: "promise",
        route: "/promise/promisekey2",
        lookupVersion: lookup.lookupVersion,
      });
      return response;
    } catch (fallbackError) {
      trackLookupMetric("lookup_fallback_failure", {
        domain: "promise",
        route: "/promise/promisekey2",
        lookupVersion: lookup.lookupVersion,
        status: getLookupHttpStatus(fallbackError),
        serverCode: getLookupServerCode(fallbackError),
      });
      throw fallbackError;
    }
  }
};

type LookupMetricEvent =
  | "lookup_request"
  | "lookup_success"
  | "lookup_failure"
  | "lookup_fallback_attempt"
  | "lookup_fallback_success"
  | "lookup_fallback_failure"
  | "lookup_fallback_blocked_server";

interface LookupMetricPayload {
  domain: "group" | "promise";
  route: string;
  lookupVersion?: number;
  status?: number;
  serverCode?: string;
}

export const trackLookupMetric = (
  event: LookupMetricEvent,
  payload: LookupMetricPayload
) => {
  console.info("[LookupMetric]", event, payload);
};

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CryptoBenchmarkResult,
  runCryptoBenchmark,
} from "@/utils/client/crypto/perf/crypto-benchmark";

type Scenario = {
  key: string;
  label: string;
  payloadCount: number;
  payloadSizeBytes: number;
};

type DeviceSegment = {
  id: string;
  label: string;
  scale: number;
  note: string;
};

type DeviceInfo = {
  isMobile: boolean;
  hardwareConcurrency: number | null;
  deviceMemory: number | null;
};

type SegmentRunRecord = {
  runAt: string;
  segmentLabel: string;
  scenarioResults: CryptoBenchmarkResult[];
};

type CandidateABSummary = {
  key: string;
  label: string;
  runs: number;
  avgMainMs: number;
  avgWorkerMs: number;
  avgMainLongTaskCount: number;
  avgWorkerLongTaskCount: number;
  diffMs: number;
  workerVsMainRatio: number;
  winner: "Main" | "Worker";
};

const BASE_SCENARIOS: Scenario[] = [
  { key: "small", label: "Small", payloadCount: 200, payloadSizeBytes: 64 },
  { key: "medium", label: "Medium", payloadCount: 1200, payloadSizeBytes: 64 },
  { key: "large", label: "Large", payloadCount: 4000, payloadSizeBytes: 128 },
];

const DEVICE_SEGMENTS: DeviceSegment[] = [
  {
    id: "desktop-default",
    label: "Desktop 기본",
    scale: 1,
    note: "데스크톱 기본 측정",
  },
  {
    id: "desktop-low-end-simulated",
    label: "Desktop 저사양 시뮬레이션",
    scale: 2,
    note: "payloadCount를 2배로 확대해 저사양군을 근사",
  },
  {
    id: "mobile-real",
    label: "Mobile 실기기",
    scale: 1,
    note: "실제 모바일 기기에서 직접 측정",
  },
  {
    id: "mobile-low-end-simulated",
    label: "Mobile 저사양 시뮬레이션",
    scale: 2,
    note: "모바일 실기기 + payloadCount 2배 측정",
  },
];

const CANDIDATE_SECTIONS: Scenario[] = [
  {
    key: "candidate-a",
    label: "Candidate A (멤버 다건 짧은 문자열)",
    payloadCount: 1600,
    payloadSizeBytes: 64,
  },
  {
    key: "candidate-b",
    label: "Candidate B (스케줄 상세 중간 페이로드)",
    payloadCount: 800,
    payloadSizeBytes: 256,
  },
  {
    key: "candidate-c",
    label: "Candidate C (대형 페이로드 혼합 구간)",
    payloadCount: 500,
    payloadSizeBytes: 1024,
  },
];

export default function CryptoPocPage() {
  const [isRunningScenarios, setIsRunningScenarios] = useState(false);
  const [isRunningCandidates, setIsRunningCandidates] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(
    DEVICE_SEGMENTS[0].id
  );
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    hardwareConcurrency: null,
    deviceMemory: null,
  });
  const [results, setResults] = useState<CryptoBenchmarkResult[]>([]);
  const [segmentRunRecords, setSegmentRunRecords] = useState<SegmentRunRecord[]>([]);
  const [candidateRuns, setCandidateRuns] = useState<number>(3);
  const [candidateABSummary, setCandidateABSummary] = useState<CandidateABSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(ua);
    const hardwareConcurrency =
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : null;
    const deviceMemory =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory ===
      "number"
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null
        : null;

    setDeviceInfo({ isMobile, hardwareConcurrency, deviceMemory });

    if (isMobile) {
      setSelectedSegmentId("mobile-real");
    }
  }, []);

  const selectedSegment = useMemo(
    () =>
      DEVICE_SEGMENTS.find((segment) => segment.id === selectedSegmentId) ??
      DEVICE_SEGMENTS[0],
    [selectedSegmentId]
  );

  const scaledScenarios = useMemo(
    () =>
      BASE_SCENARIOS.map((scenario) => ({
        ...scenario,
        payloadCount: scenario.payloadCount * selectedSegment.scale,
      })),
    [selectedSegment.scale]
  );

  const summary = useMemo(() => {
    if (results.length === 0) return null;
    return results.map((result) => {
      const diffMs = result.mainThreadDurationMs - result.workerDurationMs;
      const ratio =
        result.mainThreadDurationMs > 0
          ? (result.workerDurationMs / result.mainThreadDurationMs) * 100
          : 0;
      return { ...result, diffMs, ratio };
    });
  }, [results]);

  const handleRunScenarios = async () => {
    setError(null);
    setResults([]);
    setIsRunningScenarios(true);
    let runningScenarioLabel = "unknown";

    try {
      const nextResults: CryptoBenchmarkResult[] = [];

      for (const scenario of scaledScenarios) {
        runningScenarioLabel = scenario.label;
        const result = await runCryptoBenchmark({
          payloadCount: scenario.payloadCount,
          payloadSizeBytes: scenario.payloadSizeBytes,
        });
        nextResults.push(result);
        setResults([...nextResults]);
      }

      setSegmentRunRecords((prev) => [
        {
          runAt: new Date().toISOString(),
          segmentLabel: selectedSegment.label,
          scenarioResults: nextResults,
        },
        ...prev,
      ]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : `benchmark failed during scenario: ${runningScenarioLabel}`
      );
    } finally {
      setIsRunningScenarios(false);
    }
  };

  const handleRunCandidateAB = async () => {
    setError(null);
    setCandidateABSummary([]);
    setIsRunningCandidates(true);

    try {
      const summaries: CandidateABSummary[] = [];
      const repeatCount = Math.max(1, Math.min(candidateRuns, 10));

      for (const candidate of CANDIDATE_SECTIONS) {
        const runResults: CryptoBenchmarkResult[] = [];
        for (let i = 0; i < repeatCount; i++) {
          const result = await runCryptoBenchmark({
            payloadCount: candidate.payloadCount,
            payloadSizeBytes: candidate.payloadSizeBytes,
          });
          runResults.push(result);
        }

        const avgMainMs =
          runResults.reduce((sum, item) => sum + item.mainThreadDurationMs, 0) /
          repeatCount;
        const avgWorkerMs =
          runResults.reduce((sum, item) => sum + item.workerDurationMs, 0) / repeatCount;
        const avgMainLongTaskCount =
          runResults.reduce(
            (sum, item) => sum + item.mainThreadLongTasks.longTaskCount,
            0
          ) / repeatCount;
        const avgWorkerLongTaskCount =
          runResults.reduce(
            (sum, item) => sum + item.workerLongTasks.longTaskCount,
            0
          ) / repeatCount;
        const diffMs = avgMainMs - avgWorkerMs;
        const workerVsMainRatio = avgMainMs > 0 ? (avgWorkerMs / avgMainMs) * 100 : 0;

        summaries.push({
          key: candidate.key,
          label: candidate.label,
          runs: repeatCount,
          avgMainMs,
          avgWorkerMs,
          avgMainLongTaskCount,
          avgWorkerLongTaskCount,
          diffMs,
          workerVsMainRatio,
          winner: avgWorkerMs < avgMainMs ? "Worker" : "Main",
        });
      }

      setCandidateABSummary(summaries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "candidate AB benchmark failed");
    } finally {
      setIsRunningCandidates(false);
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#f9f9f9] p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-xl font-bold">E2EE Worker PoC Benchmark</h1>
        <p className="text-sm text-gray-600">
          디바이스 분리 측정(저사양군/모바일 포함)과 후보 3개 구간 A/B(Main vs
          Worker) 테스트를 수행합니다.
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="rounded-lg bg-white border border-gray-200 p-4 space-y-3">
          <h2 className="font-semibold">1) 디바이스 분리 측정</h2>
          <p className="text-sm text-gray-600">
            자동 감지 정보와 세그먼트를 선택해 기본 시나리오(Small/Medium/Large)를
            측정합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
              <p>감지된 디바이스: {deviceInfo.isMobile ? "Mobile" : "Desktop"}</p>
              <p>
                hardwareConcurrency:{" "}
                {deviceInfo.hardwareConcurrency ?? "unavailable"}
              </p>
              <p>deviceMemory(GB): {deviceInfo.deviceMemory ?? "unavailable"}</p>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-gray-700">측정 세그먼트</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={selectedSegment.id}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
                disabled={isRunningScenarios || isRunningCandidates}
              >
                {DEVICE_SEGMENTS.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500">{selectedSegment.note}</span>
            </label>
          </div>
          <button
            type="button"
            onClick={handleRunScenarios}
            disabled={isRunningScenarios || isRunningCandidates}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          >
            {isRunningScenarios ? "측정 중..." : "세그먼트 시나리오 실행"}
          </button>

          <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-3">Scenario</th>
                  <th className="text-right p-3">Payload</th>
                  <th className="text-right p-3">Main(ms)</th>
                  <th className="text-right p-3">Worker(ms)</th>
                  <th className="text-right p-3">Diff(ms)</th>
                  <th className="text-right p-3">Worker/Main</th>
                  <th className="text-right p-3">Main LongTask</th>
                  <th className="text-right p-3">Worker LongTask</th>
                </tr>
              </thead>
              <tbody>
                {scaledScenarios.map((scenario, index) => {
                  const result = summary?.[index];
                  return (
                    <tr key={scenario.key} className="border-t border-gray-100">
                      <td className="p-3">{scenario.label}</td>
                      <td className="p-3 text-right">
                        {scenario.payloadCount} × {scenario.payloadSizeBytes}B
                      </td>
                      <td className="p-3 text-right">
                        {result ? result.mainThreadDurationMs.toFixed(2) : "-"}
                      </td>
                      <td className="p-3 text-right">
                        {result ? result.workerDurationMs.toFixed(2) : "-"}
                      </td>
                      <td className="p-3 text-right">
                        {result ? result.diffMs.toFixed(2) : "-"}
                      </td>
                      <td className="p-3 text-right">
                        {result ? `${result.ratio.toFixed(1)}%` : "-"}
                      </td>
                      <td className="p-3 text-right">
                        {result ? result.mainThreadLongTasks.longTaskCount : "-"}
                      </td>
                      <td className="p-3 text-right">
                        {result ? result.workerLongTasks.longTaskCount : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-3">Run At</th>
                  <th className="text-left p-3">Segment</th>
                  <th className="text-right p-3">Small Worker/Main</th>
                  <th className="text-right p-3">Medium Worker/Main</th>
                  <th className="text-right p-3">Large Worker/Main</th>
                </tr>
              </thead>
              <tbody>
                {segmentRunRecords.length === 0 ? (
                  <tr className="border-t border-gray-100">
                    <td colSpan={5} className="p-3 text-center text-gray-500">
                      측정 기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  segmentRunRecords.map((record) => {
                    const ratioText = (index: number) => {
                      const item = record.scenarioResults[index];
                      if (!item || item.mainThreadDurationMs === 0) return "-";
                      return `${(
                        (item.workerDurationMs / item.mainThreadDurationMs) *
                        100
                      ).toFixed(1)}%`;
                    };
                    return (
                      <tr key={`${record.runAt}-${record.segmentLabel}`} className="border-t border-gray-100">
                        <td className="p-3">
                          {new Date(record.runAt).toLocaleString()}
                        </td>
                        <td className="p-3">{record.segmentLabel}</td>
                        <td className="p-3 text-right">{ratioText(0)}</td>
                        <td className="p-3 text-right">{ratioText(1)}</td>
                        <td className="p-3 text-right">{ratioText(2)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-white border border-gray-200 p-4 space-y-3">
          <h2 className="font-semibold">2) 후보 3개 구간 A/B 테스트 (Main vs Worker)</h2>
          <p className="text-sm text-gray-600">
            후보 A/B/C를 지정된 반복 횟수만큼 실행하고 평균값으로 Main/Worker 우세를
            비교합니다.
          </p>
          <div className="flex gap-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">후보별 반복 횟수 (1~10)</span>
              <input
                type="number"
                min={1}
                max={10}
                value={candidateRuns}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  setCandidateRuns(value);
                }}
                disabled={isRunningScenarios || isRunningCandidates}
                className="border border-gray-300 rounded-md px-3 py-2 w-40 bg-white"
              />
            </label>
            <button
              type="button"
              onClick={handleRunCandidateAB}
              disabled={isRunningScenarios || isRunningCandidates}
              className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
            >
              {isRunningCandidates ? "A/B 측정 중..." : "후보 A/B 테스트 실행"}
            </button>
          </div>

          <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-3">Candidate</th>
                  <th className="text-right p-3">Runs</th>
                  <th className="text-right p-3">Avg Main(ms)</th>
                  <th className="text-right p-3">Avg Worker(ms)</th>
                  <th className="text-right p-3">Diff(ms)</th>
                  <th className="text-right p-3">Worker/Main</th>
                  <th className="text-right p-3">Avg Main LT</th>
                  <th className="text-right p-3">Avg Worker LT</th>
                  <th className="text-right p-3">Winner</th>
                </tr>
              </thead>
              <tbody>
                {candidateABSummary.length === 0 ? (
                  <tr className="border-t border-gray-100">
                    <td colSpan={9} className="p-3 text-center text-gray-500">
                      아직 A/B 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  candidateABSummary.map((item) => (
                    <tr key={item.key} className="border-t border-gray-100">
                      <td className="p-3">{item.label}</td>
                      <td className="p-3 text-right">{item.runs}</td>
                      <td className="p-3 text-right">{item.avgMainMs.toFixed(2)}</td>
                      <td className="p-3 text-right">{item.avgWorkerMs.toFixed(2)}</td>
                      <td className="p-3 text-right">{item.diffMs.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        {item.workerVsMainRatio.toFixed(1)}%
                      </td>
                      <td className="p-3 text-right">
                        {item.avgMainLongTaskCount.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        {item.avgWorkerLongTaskCount.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-semibold">{item.winner}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

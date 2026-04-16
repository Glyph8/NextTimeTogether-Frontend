"use client";

import { useMemo, useState } from "react";
import {
  CryptoBenchmarkResult,
  runCryptoBenchmark,
} from "@/utils/client/crypto/perf/crypto-benchmark";

type Scenario = {
  label: string;
  payloadCount: number;
  payloadSizeBytes: number;
};

const SCENARIOS: Scenario[] = [
  { label: "Small", payloadCount: 200, payloadSizeBytes: 64 },
  { label: "Medium", payloadCount: 1200, payloadSizeBytes: 64 },
  { label: "Large", payloadCount: 4000, payloadSizeBytes: 128 },
];

export default function CryptoPocPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CryptoBenchmarkResult[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleRun = async () => {
    setError(null);
    setResults([]);
    setIsRunning(true);

    try {
      const nextResults: CryptoBenchmarkResult[] = [];

      for (const scenario of SCENARIOS) {
        const result = await runCryptoBenchmark({
          payloadCount: scenario.payloadCount,
          payloadSizeBytes: scenario.payloadSizeBytes,
        });
        nextResults.push(result);
        setResults([...nextResults]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "benchmark failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#f9f9f9] p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-xl font-bold">E2EE Worker PoC Benchmark</h1>
        <p className="text-sm text-gray-600">
          메인 스레드 복호화와 Worker 오프로딩 복호화를 동일 입력으로 비교합니다.
        </p>
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          {isRunning ? "측정 중..." : "시나리오 실행"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

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
              {SCENARIOS.map((scenario, index) => {
                const result = summary?.[index];
                return (
                  <tr key={scenario.label} className="border-t border-gray-100">
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
      </div>
    </div>
  );
}


"use client";

import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import Menu from "@/assets/svgs/icons/menu-black.svg";
import { useEffect, useState } from "react";
import { When2Meet } from "./When2Meet";
import { Where2Meet } from "./Where2Meet";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ScheduleDrawer } from "./components/ScheduleDrawer";
import { WhenConfirmDrawer } from "./components/WhenConfirmDrawer";
import { useQuery } from "@tanstack/react-query";
import {
  getEncryptedPromiseMemberId,
  getPromiseMemberDetail,
} from "@/api/promise-view-create";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import {
  getEncPromiseId,
  getEncPromiseKeyWithLookupFallback,
} from "@/api/promise-key";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { useCurrentUserId } from "@/lib/currentUser";
import { useGroupDetail } from "@/app/(dashboard)/groups/detail/[groupId]/hooks/use-group-detail";
import {
  CheckWhenConfirmed,
  CheckWhereConfirmed,
} from "@/api/appointment";
import { ConfirmedTimeCard } from "@/app/(dashboard)/appointment/[scheduleId]/detail/components/ConfirmedTimeCard";
import { parseScheduleString } from "@/app/(dashboard)/appointment/[scheduleId]/detail/utils/formatter";
import { parseConfrimedPromiseDateTime } from "../utils/promise-utils";
import toast from "react-hot-toast";
import { ConfirmedPlaceCard } from "@/app/(dashboard)/appointment/[scheduleId]/detail/components/ConfirmedPlaceCard";
import { getLookupUserMessage } from "@/api/lookup-error";

interface PromiseData {
  encMembers: any; // 실제 타입으로 변경 (예: EncryptedPromiseMemberId)
  managerId: string;
  memberDetails: any[]; // 실제 타입으로 변경 (예: PromiseMemberDetail[])
}

export default function ScheduleDetailPage() {
  const params = useParams<{ groupId: string; promiseId: string }>();
  const promiseId = params.promiseId;
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "약속 상세";
  const groupId = params.groupId;
  const router = useRouter();
  const [tab, setTab] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whenConfirmOpen, setWhenConfirmOpen] = useState(false);
  const {
    data: groupDetail,
    groupKey,
    isPending: isGroupFetching,
  } = useGroupDetail(groupId);

  const userId = useCurrentUserId();

  const handlePromiseError = (error: any) => {
    const status = error?.response?.status;
    if (status === 404) {
      toast.error("확정되거나 삭제된 약속입니다.");
      router.push("/appointment");
      return true; // 에러 처리됨
    }
    if (status === 403) {
      toast.error("약속 조회 권한이 없습니다.");
      router.push(`/groups/detail/${groupId}`);
      return true;
    }
    if (status === 400) {
      toast.error("요청 형식이 올바르지 않습니다.");
      return true;
    }
    return false; // 처리되지 않음
  };

  const { data: promiseKey, isLoading: isKeyLoading } = useQuery({
    queryKey: ["promiseKey", promiseId],
    queryFn: async () => {
      const masterKey = await getMasterKey();
      if (!userId || !masterKey) {
        throw new Error("사용자 정보 또는 마스터 키가 없습니다.");
      }

      if (!groupKey) {
        throw new Error("그룹 키가 없습니다.");
      }

      if (!userId) {
        throw new Error("유저 아이디가 없습니다.");
      }

      try {
        const result = await getEncPromiseKeyWithLookupFallback({
          promiseId,
          getLegacyEncUserId: async () =>
            encryptDataClient(userId, groupKey, "group_sharekey"),
        });

        const decPromiseKey = await decryptDataWithCryptoKey(
          result.encPromiseKey,
          masterKey,
          "promise_proxy_user"
        );
        return decPromiseKey;
      } catch (error) {
        // 신규 생성된 약속의 경우 lookup 인덱스가 아직 없을 수 있으므로
        // 서버 조회 실패 시 URL Hash 의 pkey 를 먼저 시도 (생성 직후 공유 링크 케이스).
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash && hash.includes("pkey=")) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const extractedKeyString = hashParams.get("pkey");
          if (extractedKeyString) {
            return extractedKeyString;
          }
        }

        // Hash 도 없는 경우에만 redirect 정책 적용 (404 = 삭제/확정된 약속).
        if (handlePromiseError(error)) {
          return null;
        }

        console.warn("[promiseKey] 조회 실패, null 반환:", {
          status: (error as { response?: { status?: number } })?.response?.status,
        });
        toast.error(getLookupUserMessage(error, "약속 키 조회에 실패했습니다."));
        return null;
      }
    },
    // ✅ [수정] groupKey와 필수 데이터가 준비될 때까지 대기
    enabled: !!groupKey && !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { data, isPending } = useQuery<PromiseData>({
    queryKey: ["promiseId", "encPromiseIds", promiseKey, groupKey], // queryKey에 의존성 추가 권장
    queryFn: async () => {
      try {
        console.log("🔵 암호화된 약속 멤버 ID 조회");
        const result = await getEncryptedPromiseMemberId(promiseId);

        // result.userIds가 배열인지 확인 (방어 코드)
        const targetIds = result.userIds || [];
        if (!promiseKey || !groupKey) {
          console.warn(
            "⚠️ 암호화 키가 없어 더미 데이터를 사용하여 렌더링합니다."
          );
          throw new Error("암호화 키가 없습니다.");
        }
        // 백엔드 스펙상 promiseKey 가 아니라 groupKey 로 암호화되어 내려옴.
        // 추후 promiseKey 분리 시 이 부분도 함께 변경 필요.
        const decryptedMemberIds = await Promise.all(
          targetIds.map(async (id) =>
            decryptDataWithCryptoKey(id, groupKey, "group_sharekey")
          )
        );

        const memberDetails = await getPromiseMemberDetail(promiseId, {
          userIds: decryptedMemberIds,
        });

        return {
          encMembers: result || [],
          managerId: memberDetails.promiseManager,
          memberDetails: memberDetails.users, // 필요하다면 상세 정보도 리턴
        };
      } catch (error) {
        if (handlePromiseError(error)) {
          throw error; // 쿼리 실패로 처리하되, 리다이렉트는 수행됨
        }
        throw error;
      }
    },
    // [중요] promiseKey가 존재할 때만 이 쿼리를 실행 (Dependent Query)
    enabled: !!promiseKey && !!groupKey,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const isMaster = data?.managerId === userId;
  const encPromiseMemberList = data?.encMembers;

  // [중요] 시간/장소 확정 여부 조회는 약속 자체의 존재 검증을 책임지지 않는다.
  // - 미확정(404/500)은 API 레이어에서 null 로 정규화됨 → 정상 응답으로 취급.
  // - 그 외 에러도 polling 에서는 redirect 하지 않고 단순히 미확정으로 간주.
  // - 약속 존재 자체가 무효화된 경우는 메인 데이터 쿼리(getEncryptedPromiseMemberId)
  //   가 잡아서 handlePromiseError 로 처리한다.
  const { data: confirmedTime, isLoading: isConfirmedTimeLoading } = useQuery({
    queryKey: ["confirmedTime", promiseId],
    queryFn: async () => {
      try {
        return await CheckWhenConfirmed(promiseId);
      } catch (error) {
        console.warn("[confirmedTime] polling 에러, 미확정으로 간주:", error);
        return null;
      }
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.dateTime) return 9000;
      return 6000;
    },
    refetchIntervalInBackground: false,
    staleTime: 0,
    placeholderData: (previousData) => previousData,
    enabled: !!promiseId,
  });

  const { data: confirmedPlace, isLoading: isConfirmedPlaceLoading } = useQuery({
    queryKey: ["confirmedPlace", promiseId],
    queryFn: async () => {
      try {
        return await CheckWhereConfirmed(promiseId);
      } catch (error) {
        console.warn("[confirmedPlace] polling 에러, 미확정으로 간주:", error);
        return null;
      }
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.placeName) return false;
      return 6000;
    },
    refetchIntervalInBackground: false,
    staleTime: 0,
    placeholderData: (previousData) => previousData,
    enabled: !!promiseId,
  });


  const handleBack = () => {
    if (groupId) {
      // groupId가 있으면 그룹 상세 페이지로 이동
      router.push(`/groups/detail/${groupId}`);
    } else {
      router.push(`/groups`);
    }
  };

  const isTimeConfirmed = !!confirmedTime && !!confirmedTime.dateTime;
  const isPlaceConfirmed = !!confirmedPlace && !!confirmedPlace.placeName;

  // [수정] 로딩 상태 정의: 키 로딩 중이거나, 키가 있는데 데이터 로딩 중 (키 없으면 로딩 끝)
  const isGlobalLoading = isKeyLoading || (!!promiseKey && isPending);
  // 키도 없고 로딩도 끝났으면 에러 상태
  const isKeyError = !isKeyLoading && !promiseKey;

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f9f9f9]">
      <ScheduleDrawer
        open={menuOpen}
        setOpen={setMenuOpen}
        isMaster={isMaster}
        managerId={data?.managerId ?? ""}
        promiseId={promiseId}
        participants={
          data?.memberDetails ?? encPromiseMemberList?.userIds ?? []
        }
        onConfirmClick={() => {
          setMenuOpen(false);
          setWhenConfirmOpen(true);
        }}
        onConfirmPlace={() => {
          const query = `promiseId=${promiseId}${groupId ? `&groupId=${groupId}` : ""
            }`;

          if (!confirmedTime) {
            toast.error("일시를 먼저 확정해주세요!");
            return;
          }

          router.push(
            `/groups/detail/${groupId}/schedules/confirm-place?${query}`
          );
        }}
      />

      {isMaster && (
        <WhenConfirmDrawer
          open={whenConfirmOpen}
          setOpen={setWhenConfirmOpen}
          promiseId={promiseId}
        />
      )}

      <Header
        leftChild={
          <button type="button" aria-label="뒤로가기" onClick={handleBack}>
            <LeftArrow />
          </button>
        }
        title={title}
        rightChild={
          <button
            type="button"
            aria-label="메뉴열기"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        }
        setShadow={false}
      />
      <nav
        role="tablist"
        aria-label="일정 장세 탭"
        className="w-full flex h-12 text-base font-medium leading-tight bg-white"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab}
          className={`w-full flex justify-center items-center border-b-2 
                    ${tab
              ? "text-main border-main"
              : "text-[#999999] border-[#D4D4D4]"
            }  transition-all duration-200`}
          onClick={() => setTab(true)}
        >
          언제
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab}
          className={`w-full flex justify-center items-center border-b-2 
                    ${tab
              ? "text-[#999999] border-[#D4D4D4]"
              : "text-main border-main"
            }  transition-all duration-200`}
          onClick={() => setTab(false)}
        >
          어디서
        </button>
      </nav>

      {isGlobalLoading ? (
        <DefaultLoading />
      ) : isKeyError ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">약속 정보를 불러올 수 없습니다. (키 오류)</p>
        </div>
      ) : tab ? (
        isTimeConfirmed ? (
          <div className="p-4">
            <ConfirmedTimeCard
              date={parseConfrimedPromiseDateTime(confirmedTime.dateTime).date}
              time={parseConfrimedPromiseDateTime(confirmedTime.dateTime).time}
            />
          </div>
        ) : (
          <When2Meet
            promiseId={promiseId}
            encMemberIdList={encPromiseMemberList}
          />
        )
      ) : (
        isPlaceConfirmed ? (
          <div className="p-4">
            <ConfirmedPlaceCard
              placeName={confirmedPlace.placeName}
              placeAddress={confirmedPlace.placeAddress}
            />
          </div>
        ) : (
          <Where2Meet
            encMemberIdList={encPromiseMemberList}
          />
        )
      )}
    </div>
  );
}

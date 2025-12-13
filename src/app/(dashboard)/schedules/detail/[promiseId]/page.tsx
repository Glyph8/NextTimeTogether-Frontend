"use client";

import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import Menu from "@/assets/svgs/icons/menu-black.svg";
import { useState } from "react";
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
import { getEncPromiseId, getEncPromiseKey } from "@/api/promise-key";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { useAuthStore } from "@/store/auth.store";
import { useGroupStore } from "@/store/group-detail.store";
import { useGroupDetail } from "@/app/(dashboard)/groups/detail/[groupId]/hooks/use-group-detail";

interface PromiseData {
  encMembers: any; // 실제 타입으로 변경 (예: EncryptedPromiseMemberId)
  managerId: string;
  memberDetails: any[]; // 실제 타입으로 변경 (예: PromiseMemberDetail[])
}

export default function ScheduleDetailPage() {
  const params = useParams<{ promiseId: string }>();
  const promiseId = params.promiseId;
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "약속 상세";
  const groupId = searchParams.get("groupId");
  const router = useRouter();
  const [tab, setTab] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whenConfirmOpen, setWhenConfirmOpen] = useState(false);
    const {
      data: groupDetail,
      groupKey,
      isPending: isGroupFetching,
    } = useGroupDetail(groupId);

  const decryptedUserId = localStorage.getItem("hashed_user_id_for_manager");
   const userId = useAuthStore.getState().userId;
   console.log("groupKey in detail page:", groupKey);


    const { data:promiseKey, isLoading: isKeyLoading } = useQuery({
    queryKey: ["promiseKey", promiseId],
    queryFn: async () => {
      const masterKey = await getMasterKey();
      if (!decryptedUserId || !masterKey) {
        throw new Error("사용자 정보 또는 마스터 키가 없습니다.");
      }

      if(!groupKey){
        throw new Error("그룹 키가 없습니다.");
      }

      if(!userId){
        throw new Error("유저 아이디가 없습니다.");
      }
      
      const encUserId = await encryptDataClient(
        decryptedUserId,
        // userId,
        // masterKey,
        groupKey,
        // "promise_proxy_user"
         "group_sharekey"
      );
      const test = await getEncPromiseId();
      const targetIds = test.encPromiseIdList || [];
      console.log("대상 배열 길이:", targetIds.length); //
       const decryptedPromiseIds = await Promise.all(
      targetIds.map(async (id) => {
        return await decryptDataWithCryptoKey(
          id,
          masterKey,
          // "promise_sharekey"
          "promise_proxy_user"
        );
      })
    );
    console.log("테스트 복호화된Promise 아이디들 :", decryptedPromiseIds);
      const result = await getEncPromiseKey({promiseId, encUserId});
      const decPromiseKey = await decryptDataWithCryptoKey(
        result.encPromiseKey,
        masterKey,
        // "promise_sharekey"
        "promise_proxy_user"
      );
      return decPromiseKey;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { data, isPending } = useQuery<PromiseData>({
  queryKey: ["promiseId", "encPromiseIds", promiseKey], // queryKey에 의존성 추가 권장
  queryFn: async () => {
    console.log("🔵 암호화된 약속 멤버 ID 조회");
    const result = await getEncryptedPromiseMemberId(promiseId);
    
    // result.userIds가 배열인지 확인 (방어 코드)
    const targetIds = result.userIds || [];
    if (!promiseKey) {
        throw new Error("암호화 키가 없습니다."); 
      }
    // [핵심] 배열 내 모든 원소에 대해 비동기 복호화 수행
    const decryptedUserIds = await Promise.all(
      targetIds.map(async (id) => {
        return await decryptDataWithCryptoKey(
          id,
          promiseKey, // 상위 스코프의 promiseKey 사용
          "promise_proxy_user"
        );
      })
    );

    // 복호화된 ID 목록(decryptedUserIds)을 상세 조회 함수에 전달 mem s2
    const memberDetails = await getPromiseMemberDetail(promiseId, {userIds:decryptedUserIds});

    return {
      encMembers: result || [],
      managerId: memberDetails.promiseManager,
      memberDetails: memberDetails.users // 필요하다면 상세 정보도 리턴
    };
  },
  // [중요] promiseKey가 존재할 때만 이 쿼리를 실행 (Dependent Query)
  enabled: !!promiseKey, 
  staleTime: 1000 * 60 * 5,
  retry: 1,
});

  // const { data, isPending } = useQuery({
  //   queryKey: ["promiseId", "encPromiseIds"],
  //   queryFn: async () => {
  //     console.log("🔵 암호화된 약속 멤버 ID 조회");
  //     const result = await getEncryptedPromiseMemberId(promiseId);

  //     // userIds는 string 배열임. 각 원소에 대해 decryptDataWithCryptoKey 호출 필요
  //     const decResult = await decryptDataWithCryptoKey(
  //       result.userIds,
  //       promiseKey,
  //       "promise_proxy_user"
  //     )

  //     const decUsersIds = await getPromiseMemberDetail(promiseId, result);
  //     return {
  //       encMembers: result || [],
  //       managerId: decUsersIds.promiseManager, // 매니저 ID도 데이터에 포함
  //     };
  //   },
  //   staleTime: 1000 * 60 * 5,
  //   retry: 1,
  // });



  const isMaster = data?.managerId === decryptedUserId;
  console.log(
    "약속 매니저 아이디 : ",
    data?.managerId,
    "복호화된 유저 아이디 :",
    decryptedUserId,
    "매니저 여부 :",
    isMaster
  );
  const encPromiseMemberList = data?.encMembers;

  const handleBack = () => {
    if (groupId) {
      // groupId가 있으면 그룹 상세 페이지로 이동
      router.push(`/groups/detail/${groupId}`);
    } else {
      // groupId가 없으면 일반적인 뒤로가기 (예외 처리)
      router.back();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f9f9f9]">
      <ScheduleDrawer
        open={menuOpen}
        setOpen={setMenuOpen}
        isMaster={isMaster}
        managerId={data?.managerId ?? ""}
        promiseId={promiseId}
        participants={encPromiseMemberList?.userIds ?? []}
        onConfirmClick={() => {
          setMenuOpen(false);
          setWhenConfirmOpen(true);
        }}
        onConfirmPlace={() => {
          // TODO : 장소 확정 페이지로 이동
          // router.push(`/schedules/confirm-place?promiseId=${promiseId}`);
          const query = `promiseId=${promiseId}${
            groupId ? `&groupId=${groupId}` : ""
          }`;
          router.push(`/schedules/confirm-place?${query}`);
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
                    ${
                      tab
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
                    ${
                      tab
                        ? "text-[#999999] border-[#D4D4D4]"
                        : "text-main border-main"
                    }  transition-all duration-200`}
          onClick={() => setTab(false)}
        >
          어디서
        </button>
      </nav>

      {isPending || !encPromiseMemberList ? (
        <DefaultLoading />
      ) : tab ? (
        <When2Meet
          promiseId={promiseId}
          encMemberIdList={encPromiseMemberList}
        />
      ) : (
        <Where2Meet encMemberIdList={encPromiseMemberList} />
      )}
    </div>
  );
}

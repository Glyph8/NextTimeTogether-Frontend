import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";
import { getMasterKey } from "@/utils/client/key-storage";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";

import {
  apiGetGroupJoinRequest,
  apiPostGroupMemberSave,
} from "@/api/group-invite-join";

export type JoinStatus = "CHECKING" | "READY" | "JOINING" | "ERROR";

export const useJoinGroup = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [status, setStatus] = useState<JoinStatus>("CHECKING");
  const [groupKey, setGroupKey] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const myUserId = useAuthStore((state) => state.userId);

  // 1. 초기화: URL 해시에서 키 추출 및 로그인/그룹 유효성 체크
  useEffect(() => {
    if (typeof window === "undefined") return;

    // URL Hash에서 키 추출 (#key=ABC...)
    const hashString = window.location.hash;
    const searchParams = new URLSearchParams(hashString.substring(1));
    const extractedKey = searchParams.get("key");

    if (!extractedKey) {
      toast.error("잘못된 초대 링크입니다. (암호화 키 누락)");
      setStatus("ERROR");
      return;
    }

    setGroupKey(extractedKey);

    // 로그인 안 되어 있으면 리다이렉트 (돌아올 때 Hash 유지를 위해 전체 URL 전달)
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.replace(`/login?returnUrl=${returnUrl}`);
      return;
    }

    setStatus("READY");

    // 로그인 되어 있으면 그룹 정보 조회 (GET API) - 이메일 보내는 로직이라 현재 지원 안됨.
    // apiGetGroupJoinRequest(groupId)
    //   .then(() => {
    //     setStatus("READY"); // 가입 버튼 활성화
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error("그룹 정보를 확인할 수 없습니다.");
    //     // 에러가 나도 일단 UI상 진행을 막지 않기 위해 READY로 두는 기존 로직 유지
    //     setStatus("READY");
    //   });
  }, [groupId, isAuthenticated]);

  // 2. [가입하기] 버튼 클릭 핸들러
  const handleJoinClick = async () => {
    if (!groupKey || !myUserId) return;
    setStatus("JOINING");

    try {
      // --- A. 암호화 키 준비 ---
      const masterKey = await getMasterKey();

      if (!masterKey) {
        throw new Error("보안 키 로드 실패. 다시 로그인해주세요.");
      }

      // --- B. 데이터 암호화 (Client-Side Encryption) ---
      // NOTE: 기존 로직의 암호화 흐름 유지

      const encGroupKey = await encryptDataClient(
        groupKey,
        masterKey,
        "group_sharekey"
      );

      const encGroupId = await encryptDataClient(
        groupId,
        masterKey,
        "group_proxy_user"
      );

      // 기존 로직 주석 및 흐름 유지
      // TODO : 암호화할 때 그룹키인지 마스터 키인지..
      // 초대에서는 개인키를 쓰라고 명시함
      // TODO : iv도 초대에서는 proxy user 사용

      const encUserId = await encryptDataClient(
        myUserId,
        groupKey,
        "group_sharekey"
      );

      const encencGroupMemberId = await encryptDataClient(
        encUserId,
        masterKey,
        "group_proxy_user"
      );

      // --- C. 가입 요청 전송 (POST) ---
      await apiPostGroupMemberSave({
        groupId,
        encGroupKey,
        encUserId,
        encGroupId,
        encencGroupMemberId,
      });

      // 성공 시
      toast.success("그룹 가입 완료! 환영합니다.");
      router.push(`/groups/detail/${groupId}`);
    } catch (error) {
      console.error("가입 실패:", error);
      toast.error("그룹 가입 중 오류가 발생했습니다.");
      setStatus("READY"); // 다시 시도할 수 있게 복구
    }
  };

  return {
    status,
    handleJoinClick,
    router, // 필요 시 컴포넌트에서 사용
  };
};
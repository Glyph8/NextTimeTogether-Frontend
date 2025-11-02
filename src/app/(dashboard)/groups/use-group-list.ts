"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { getMasterKey } from "@/utils/client/key-storage";
import { getEncGroupsIdAction, getEncGroupsKeyAction, getGroupsInfoAction } from "./action";
import { ViewGroupFirstResponseData, ViewGroupSecResponseData, ViewGroupThirdResponseData } from "@/api/group";
import decryptDataClient from "@/utils/client/crypto/decryptClient";
import { base64ToArrayBuffer } from "@/utils/client/helper";

interface GroupInfoData {
  groupId: string;
  groupName: string;
  groupImg: string;
  managerId: string;
  encUserId: string[];
}

export interface DecryptedGroupInfo extends Omit<GroupInfoData, "encUserId"> {
  userIds: string[];
}

/**
 * E2EE 그룹 목록 조회를 위한 3단계 폭포수 쿼리 훅
 */
export const useDecryptedGroupList = () => {
  // 1단계 결과
  const [decryptedGroupObjects, setDecryptedGroupObjects] = useState<
    { groupId: string; encGroupMemberId: string }[] | null
  >(null);
  
  // 2단계 결과
  const [decryptedGroupKeys, setDecryptedGroupKeys] = useState<CryptoKey[] | null>(null);

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // 빈 배열 조기 종료 플래그
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log("=== useDecryptedGroupList 상태 ===");
    console.log("decryptedGroupObjects:", decryptedGroupObjects);
    console.log("decryptedGroupKeys:", decryptedGroupKeys);
    console.log("isEmptyResult:", isEmptyResult);
    console.log("error:", error);
  }, [decryptedGroupObjects, decryptedGroupKeys, isEmptyResult, error]);

  // --- 1단계: 암호화된 GroupId/MemberId 조회 ---
  const { data: encData, isPending: isPending1, error: queryError1 } = useQuery({
    queryKey: ["groupList", "step1", "encIds"],
    queryFn: async () => {
      console.log("🔵 [1단계] 암호화된 그룹 ID 조회 시작");
      const result = await getEncGroupsIdAction();
      console.log("🔵 [1단계] 서버 응답:", result);
      
      if (result.error) {
        console.error("🔴 [1단계] 에러:", result.error);
        throw new Error(result.error);
      }
      
      if (!result.data || result.data.length === 0) {
        console.log("⚠️ [1단계] 데이터가 비어있음 - 조기 종료");
        return [];
      }
      
      console.log("✅ [1단계] 성공 - 데이터 개수:", result.data.length);
      return result.data as ViewGroupFirstResponseData[];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // --- 1단계 복호화 useEffect ---
  useEffect(() => {
    if (!encData) {
      console.log("⏸️ [1단계 복호화] 대기 중 - encData가 없음");
      return;
    }

    // 빈 배열이면 조기 종료 플래그 설정하고 빈 배열로 처리
    if (encData.length === 0) {
      console.log("✅ [1단계 복호화] 빈 배열 감지 - 조기 종료 처리");
      setIsEmptyResult(true);
      setDecryptedGroupObjects([]);
      return;
    }

    const decryptStep1Data = async () => {
      try {
        console.log("🟡 [1단계 복호화] 시작 - 데이터 개수:", encData.length);
        
        const masterKey = await getMasterKey();
        console.log("🟡 [1단계 복호화] 마스터키 로드 완료:", !!masterKey);
        
        if (!masterKey) {
          throw new Error("마스터키를 찾을 수 없습니다.");
        }

        const decryptedPromises = encData.map(async (item, index) => {
          console.log(`🟡 [1단계 복호화] ${index + 1}번째 항목 처리 중...`);
          
          const decryptedGroupId = await decryptDataClient(
            item.encGroupId,
            masterKey,
            "group_proxy_user"
          );
          
          const decryptedGroupMemberId = await decryptDataClient(
            item.encencGroupMemberId,
            masterKey,
            "group_proxy_user"
          );
          
          console.log(`✅ [1단계 복호화] ${index + 1}번째 완료 - groupId:`, decryptedGroupId);
          
          return {
            groupId: decryptedGroupId,
            encGroupMemberId: decryptedGroupMemberId,
          };
        });
        
        const decrypted = await Promise.all(decryptedPromises);
        console.log("✅ [1단계 복호화] 전체 완료 - 결과:", decrypted);
        
        setDecryptedGroupObjects(decrypted);
        setIsEmptyResult(false); // 정상 데이터가 있으면 플래그 해제
      } catch (err) {
        console.error("🔴 [1단계 복호화] 실패:", err);
        const errorMessage = err instanceof Error ? err.message : "1단계 복호화 오류";
        console.error("🔴 [1단계 복호화] 에러 메시지:", errorMessage);
        setError(errorMessage);
      }
    };

    decryptStep1Data();
  }, [encData]);

  // --- 2단계: 암호화된 GroupKey 조회 ---
  const { data: encKeys, isPending: isPending2, error: queryError2 } = useQuery({
    queryKey: ["groupList", "step2", "encKeys", decryptedGroupObjects],
    queryFn: async () => {
      console.log("🔵 [2단계] 암호화된 그룹 키 조회 시작");
      console.log("🔵 [2단계] 요청 데이터:", decryptedGroupObjects);
      
      const result = await getEncGroupsKeyAction(decryptedGroupObjects!);
      console.log("🔵 [2단계] 서버 응답:", result);
      
      if (result.error) {
        console.error("🔴 [2단계] 에러:", result.error);
        throw new Error(result.error);
      }
      
      console.log("✅ [2단계] 성공 - 데이터 개수:", result.data?.length);
      return result.data as ViewGroupSecResponseData[];
    },
    // 빈 배열이면 2단계 실행 안 함
    enabled: !isEmptyResult && !!decryptedGroupObjects && decryptedGroupObjects.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // --- 2단계 복호화 useEffect ---
  useEffect(() => {
    // 빈 배열 조기 종료 상태면 스킵
    if (isEmptyResult) {
      console.log("⏸️ [2단계 복호화] 빈 배열 상태로 스킵");
      return;
    }

    if (!encKeys) {
      console.log("⏸️ [2단계 복호화] 대기 중 - encKeys가 없음");
      return;
    }

    if (encKeys.length === 0) {
      console.log("⏸️ [2단계 복호화] 데이터가 비어있음");
      setDecryptedGroupKeys([]);
      return;
    }

    const decryptStep2Data = async () => {
      try {
        console.log("🟡 [2단계 복호화] 시작 - 데이터 개수:", encKeys.length);
        
        const masterKey = await getMasterKey();
        console.log("🟡 [2단계 복호화] 마스터키 로드 완료:", !!masterKey);
        
        if (!masterKey) {
          throw new Error("마스터키를 찾을 수 없습니다.");
        }

        const decryptedPromises = encKeys.map(async (item, index) => {
          console.log(`🟡 [2단계 복호화] ${index + 1}번째 그룹 키 처리 중...`);
          
          const groupKeyString = await decryptDataClient(
            item.encGroupKey,
            masterKey,
            "group_sharekey"
          );
          
          console.log(`🟡 [2단계 복호화] ${index + 1}번째 그룹 키 복호화 완료, CryptoKey로 변환 중...`);
          
          const groupKeyArrayBuffer = base64ToArrayBuffer(groupKeyString);
          
          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            groupKeyArrayBuffer,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
          );
          
          console.log(`✅ [2단계 복호화] ${index + 1}번째 CryptoKey 생성 완료`);
          
          return cryptoKey;
        });

        const newCryptoKeys = await Promise.all(decryptedPromises);
        console.log("✅ [2단계 복호화] 전체 완료 - CryptoKey 개수:", newCryptoKeys.length);
        
        setDecryptedGroupKeys(newCryptoKeys);
      } catch (err) {
        console.error("🔴 [2단계 복호화] 실패:", err);
        const errorMessage = err instanceof Error ? err.message : "2단계 복호화 오류";
        console.error("🔴 [2단계 복호화] 에러 메시지:", errorMessage);
        setError(errorMessage);
      }
    };

    decryptStep2Data();
  }, [encKeys, isEmptyResult]);

  // --- 3단계: 암호화된 그룹 정보(유저 목록) 조회 ---
  const { data: finalDecryptedData, isPending: isPending3, error: queryError3 } = useQuery<
    DecryptedGroupInfo[]
  >({
    queryKey: [
      "groupList",
      "step3",
      "finalData",
      decryptedGroupObjects,
      decryptedGroupKeys,
    ],
    queryFn: async () => {
      console.log("🔵 [3단계] 그룹 정보 조회 시작");
      
      const groupIdObjects = decryptedGroupObjects!.map((item) => ({
        groupId: item.groupId,
      }));
      
      console.log("🔵 [3단계] 요청 데이터:", groupIdObjects);
      
      const result = await getGroupsInfoAction(groupIdObjects);
      console.log("🔵 [3단계] 서버 응답:", result);
      
      if (result.error) {
        console.error("🔴 [3단계] 에러:", result.error);
        throw new Error(result.error);
      }
      
      const finalEncData = result.data as ViewGroupThirdResponseData[];
      console.log("🔵 [3단계] 암호화된 데이터 개수:", finalEncData.length);

      console.log("🟡 [3단계 복호화] 시작");
      
      const decryptedPromises = finalEncData.map(async (groupData, index) => {
        console.log(`🟡 [3단계 복호화] ${index + 1}번째 그룹 처리 중...`);
        
        const groupCryptoKey = decryptedGroupKeys![index];
        
        console.log(`🟡 [3단계 복호화] ${index + 1}번째 그룹 - 멤버 ${groupData.encUserId.length}명 복호화 시작`);

        const decryptionPromises = groupData.encUserId.map(async (encId, memberIndex) => {
          console.log(`🟡 [3단계 복호화] ${index + 1}번째 그룹 - ${memberIndex + 1}번째 멤버 복호화 중...`);
          return await decryptDataClient(encId, groupCryptoKey, "group_sharekey");
        });

        const decryptedMemberIds = await Promise.all(decryptionPromises);
        
        console.log(`✅ [3단계 복호화] ${index + 1}번째 그룹 완료 - 멤버 IDs:`, decryptedMemberIds);

        return {
          groupId: groupData.groupId,
          groupName: groupData.groupName,
          groupImg: groupData.groupImg,
          managerId: groupData.managerId,
          userIds: decryptedMemberIds,
        };
      });
      
      const result_final = await Promise.all(decryptedPromises);
      console.log("✅ [3단계 복호화] 전체 완료 - 최종 결과:", result_final);
      
      return result_final;
    },
    // 빈 배열이면 3단계 실행 안 함
    enabled: !isEmptyResult && 
             !!decryptedGroupObjects && 
             !!decryptedGroupKeys && 
             decryptedGroupObjects.length > 0 && 
             decryptedGroupKeys.length > 0 &&
             decryptedGroupObjects.length === decryptedGroupKeys.length,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 모든 쿼리 에러 통합
  useEffect(() => {
    if (queryError1) {
      console.error("🔴 [Query Error 1]:", queryError1);
      setError(queryError1.message);
    }
    if (queryError2) {
      console.error("🔴 [Query Error 2]:", queryError2);
      setError(queryError2.message);
    }
    if (queryError3) {
      console.error("🔴 [Query Error 3]:", queryError3);
      setError(queryError3.message);
    }
  }, [queryError1, queryError2, queryError3]);

  // 빈 배열 조기 종료 케이스 처리
  return {
    data: isEmptyResult ? [] : finalDecryptedData,
    isPending: isPending1 || (isEmptyResult ? false : (isPending2 || isPending3)),
    error: error || queryError1?.message || queryError2?.message || queryError3?.message,
  };
};
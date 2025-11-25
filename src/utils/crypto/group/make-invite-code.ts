import { randomUUID } from 'crypto';

/** url이 로컬 호스트여도, uuid가 랜덤 uuid여도 괜찮나..? */
// "&" 문자를 구분자로 사용하면 groupKey 또는 groupId에 "&"가 포함된 경우 토큰 파싱 시 오류가 발생할 수 있습 더 안전한 구분자를 사용하거나 JSON 직렬화를 고려하세요.
function generateGroupJoinURL(groupKey: string, groupId: string): string {
  const uuid = randomUUID();
  const token = `${groupKey}&${groupId}&${uuid}`;
  // const tokenData = { groupKey, groupId, uuid };
  // const token = JSON.stringify(tokenData);
  // 이렇게 직렬화 한 경우 decode-invite-code.ts에서 사용시, 수정 필요.
  // https://github.com/Glyph8/NextTimeTogether-Frontend/pull/16#discussion_r2426258318

  const url = `http://localhost:8080/groups/join?token=${encodeURIComponent(token)}`;
  return url;
}

// 사용 예시
// const groupKey = 'abc123KEY';
// const groupId = 'group42';

// const joinUrl = generateGroupJoinURL(groupKey, groupId);
// console.log('🔗 그룹 참가 URL:', joinUrl);


export default generateGroupJoinURL;
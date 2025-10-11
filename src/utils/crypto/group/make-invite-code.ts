import { randomUUID } from 'crypto';

/** url이 로컬 호스트여도, uuid가 랜덤 uuid여도 괜찮나..? */
function generateGroupJoinURL(groupKey: string, groupId: string): string {
  const uuid = randomUUID();
  const token = `${groupKey}&${groupId}&${uuid}`;
  const url = `http://localhost:8080/group/join?token=${encodeURIComponent(token)}`;
  return url;
}

// 사용 예시
// const groupKey = 'abc123KEY';
// const groupId = 'group42';

// const joinUrl = generateGroupJoinURL(groupKey, groupId);
// console.log('🔗 그룹 참가 URL:', joinUrl);


export default generateGroupJoinURL;
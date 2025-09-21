/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */



import { HttpClient, RequestParams, ContentType, HttpResponse } from "./http-client";
import { TimeSlotReqDTO, BaseResponseObject, UserTimeSlotDTO, UserTimeSlotReqDTO, BaseResponseString, ScheduleConfirmReqDTO, PromiseView4Request, BaseResponse, ErrorResponse, PromiseView3Request, Promiseview2Request, JoinPromise1Request, JoinPromise1Response, InvitePromise1Request, InvitePromise1Response, GetPromiseBatchReqDTO, CreatePromise4Request, CreatePromise3Request, CreatePromise2Request, CreatePromise1Request, PlaceRegisterDTO, UserAIInfoReqDTO, UserSignUpDTO, OAuth2LoginReqDTO, OAuth2LoginDetailReqDTO, LoginReqDTO, UserIdDTO, ViewGroup3Request, ViewGroup2Request, CreateGroup2Request, CreateGroup1Request, LeaveGroup2Request, LeaveGroup1Response, LeavGroup1Request, JoinGroupRequest, JoinGroupResponse, InviteGroup3Request, InviteGroup3Response, InviteGroup2Request, InviteGroup2Response, InviteGroup1Request, InviteGroup1Response, EditGroup3Request, EditGroup2Request, EditGroup1Request, CalendarViewRequest2, BaseResponseListCalendarViewResponse2, CalendarViewResponse2, CalendarViewRequest1, BaseResponseCalendarViewResponse1, CalendarViewResponse1, CalendarRewriteRequest1, BaseResponseCalendarRewriteResponse1, CalendarRewriteResponse1, CalendarCreateRequest1, BaseResponseCalendarCreateResponse1, CalendarCreateResponse1, UserIdsResDTO, ExitPromiseReqDTO, TestDTO, LeaveGroup3Request, LeaveGroup3Response } from "./data-contracts"

export class Api<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

            /**
 * @description 개인키로 암호화된 그룹키를 이용하여 그룹 레코드 및 그룹 정보를 조회하는 단계입니다. - 요청: List<ViewGroup3Request> (이전 단계에서 저장한 그룹 ID 및 그룹키) - 처리: 해당 그룹 ID에 대한 레코드 및 그룹 정보 조회 - 반환: List<ViewGroup3Response> (그룹 정보 및 레코드 리스트)
 *
 * @tags 그룹
 * @name ViewGroup3
 * @summary 그룹 메인 보기 - Step3
 * @request POST:/api/v1/group/view3
 * @secure
 */
viewGroup3: (data: (ViewGroup3Request)[], params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/view3`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 암호화된 그룹 ID와 그룹키로 암호화한 사용자 고유 아이디를 기반으로 그룹키 정보를 조회하는 단계입니다. - 요청: List<ViewGroup2Request> (암호화된 그룹 ID 및 사용자 ID) - 처리: GroupShareKey 테이블에서 개인키로 암호화한 그룹키 조회 - 반환: List<ViewGroup2Response> (개인키로 암호화된 그룹키)
 *
 * @tags 그룹
 * @name ViewGroup2
 * @summary 그룹 메인 보기 - Step2
 * @request POST:/api/v1/group/view2
 * @secure
 */
viewGroup2: (data: (ViewGroup2Request)[], params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/view2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 그룹 키 및 암호화 정보를 포함하여 그룹을 최종 생성하는 단계입니다. - 요청: GroupId, 개인키/그룹키로 암호화한 사용자 아이디 등(CreateGroup2Request) - 처리: GroupProxyUser, Group, GroupShareKey 테이블에 저장 - 반환: 생성 결과(CreateGroup2Response)
 *
 * @tags 그룹
 * @name CreateGroup2
 * @summary 그룹 만들기 - Step2
 * @request POST:/api/v1/group/new2
 * @secure
 */
createGroup2: (data: CreateGroup2Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/new2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 예비 방장이 그룹 정보를 생성하는 단계입니다. - 요청: 그룹 정보(CreateGroup1Request) - 처리: Group 테이블에 요청 기반으로 그룹 저장 - 반환: 생성된 Group의 아이디를 포함한 CreateGroup1Response
 *
 * @tags 그룹
 * @name CreateGroup1
 * @summary 그룹 만들기 - Step1
 * @request POST:/api/v1/group/new1
 * @secure
 */
createGroup1: (data: CreateGroup1Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/new1`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 서버에서 그룹에서 나가겠냐는 메시지를 반환합니다. 사용자 확인 후, 나가기 전 메시지를 안내합니다.
 *
 * @tags 그룹
 * @name LeaveGroup2
 * @summary 그룹 나가기 - Step1
 * @request POST:/api/v1/group/leave2
 * @secure
 */
leaveGroup2: (data: LeaveGroup2Request, params: RequestParams = {}) =>
    this.http.request<LeaveGroup1Response, ErrorResponse>({
        path: `/api/v1/group/leave2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 서버에서 그룹에서 나가겠냐는 메시지를 반환합니다. 사용자 확인 후, 나가기 전 메시지를 안내합니다.
 *
 * @tags 그룹
 * @name LeaveGroup1
 * @summary 그룹 나가기 - Step1
 * @request POST:/api/v1/group/leave1
 * @secure
 */
leaveGroup1: (data: LeavGroup1Request, params: RequestParams = {}) =>
    this.http.request<LeaveGroup1Response, ErrorResponse>({
        path: `/api/v1/group/leave1`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 초대코드를 사용하여 그룹에 참여합니다. 서버는 Redis에서 초대코드 유효성을 확인하고, 시도 횟수를 1 증가시킵니다. 검증 후 데이터베이스에 그룹 참여 정보를 저장합니다.
 *
 * @tags 그룹
 * @name JoinGroup
 * @summary 그룹 초대받기 - Step1
 * @request POST:/api/v1/group/join
 * @secure
 */
joinGroup: (data: JoinGroupRequest, params: RequestParams = {}) =>
    this.http.request<JoinGroupResponse, ErrorResponse>({
        path: `/api/v1/group/join`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 개인키로 그룹키를 획득 후, 그룹키, 그룹아이디, 랜덤 UUID, 초대할 유저 이메일을 랜덤 6자리 초대암호로 암호화하여 서버에 전달합니다. 서버는 Redis에 TTL 적용 후 저장하며, 초대 링크 유효성을 확인할 수 있습니다.
 *
 * @tags 그룹
 * @name InviteGroup3
 * @summary 그룹 초대 - Step3
 * @request POST:/api/v1/group/invite3
 * @secure
 */
inviteGroup3: (data: InviteGroup3Request, params: RequestParams = {}) =>
    this.http.request<InviteGroup3Response, ErrorResponse>({
        path: `/api/v1/group/invite3`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 개인키로 encencGroupMemberId를 복호화하여 encUserId를 획득 후, encUserId와 groupId로 encGroupKey를 요청합니다.
 *
 * @tags 그룹
 * @name InviteGroup2
 * @summary 그룹 초대 - Step2
 * @request POST:/api/v1/group/invite2
 * @secure
 */
inviteGroup2: (data: InviteGroup2Request, params: RequestParams = {}) =>
    this.http.request<InviteGroup2Response, ErrorResponse>({
        path: `/api/v1/group/invite2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 그룹원이 groupId와 개인키로 암호화한 그룹 아이디를 서버에 전송하면, 서버는 GroupProxyUser 테이블에서 encencGroupMemberId를 반환합니다.
 *
 * @tags 그룹
 * @name InviteGroup1
 * @summary 그룹 초대 - Step1
 * @request POST:/api/v1/group/invite1
 * @secure
 */
inviteGroup1: (data: InviteGroup1Request, params: RequestParams = {}) =>
    this.http.request<InviteGroup1Response, ErrorResponse>({
        path: `/api/v1/group/invite1`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description - 요청: 클라이언트가 개인키로 encGroupKey 를 복호화한 후 그룹키 저장 및 groupId 전송 - 처리: GroupShareKey 테이블에서 해당 groupId로 encUserId 리스트 조회 후 그룹 정보 반환
 *
 * @tags 그룹
 * @name EditGroup3
 * @summary 그룹 정보 수정 - Step3
 * @request POST:/api/v1/group/edit3
 * @secure
 */
editGroup3: (data: EditGroup3Request, params: RequestParams = {}) =>
    this.http.request<any, ErrorResponse>({
        path: `/api/v1/group/edit3`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,                ...params,
    }),            /**
 * @description - 요청: 클라이언트가 encencGroupMemberId 를 복호화해 얻은 encUserId 와 groupId 전송 - 처리: GroupShareKey 테이블에서 groupId, encUserId 에 해당하는 encGroupKey 반환
 *
 * @tags 그룹
 * @name EditGroup2
 * @summary 그룹 정보 수정 - Step2
 * @request POST:/api/v1/group/edit2
 * @secure
 */
editGroup2: (data: EditGroup2Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/edit2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 방장이 그룹 정보를 수정하는 단계입니다. - 요청: 방장이 userId와 개인키로 암호화한 그룹 아이디(encGroupId), 그룹 아이디, 수정하려는 request - 처리: Group 내 managerId == userId 인 경우 수정 요청을 반영하여 저장 - 반환: GroupProxyUser 테이블에서 userId, encGroupId 에 해당하는 encencGroupMemberId
 *
 * @tags 그룹
 * @name EditGroup1
 * @summary 그룹 정보 수정 - Step1
 * @request POST:/api/v1/group/edit1
 */
editGroup1: (data: EditGroup1Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/edit1`,
        method: 'POST',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags calendar-manage-controller
 * @name ViewCalendar2
 * @request POST:/api/v1/calendar/view2
 */
viewCalendar2: (data: CalendarViewRequest2, params: RequestParams = {}) =>
    this.http.request<BaseResponseListCalendarViewResponse2, any>({
        path: `/api/v1/calendar/view2`,
        method: 'POST',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags calendar-manage-controller
 * @name ViewCalendar1
 * @request POST:/api/v1/calendar/view1
 */
viewCalendar1: (data: CalendarViewRequest1, params: RequestParams = {}) =>
    this.http.request<BaseResponseCalendarViewResponse1, any>({
        path: `/api/v1/calendar/view1`,
        method: 'POST',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags calendar-manage-controller
 * @name RewriteCalendar1
 * @request POST:/api/v1/calendar/rewrite1
 */
rewriteCalendar1: (data: CalendarRewriteRequest1, params: RequestParams = {}) =>
    this.http.request<BaseResponseCalendarRewriteResponse1, any>({
        path: `/api/v1/calendar/rewrite1`,
        method: 'POST',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags calendar-manage-controller
 * @name CreateCalendar1
 * @request POST:/api/v1/calendar/create1
 */
createCalendar1: (data: CalendarCreateRequest1, params: RequestParams = {}) =>
    this.http.request<BaseResponseCalendarCreateResponse1, any>({
        path: `/api/v1/calendar/create1`,
        method: 'POST',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 사용자 개인키로 암호화된 그룹 정보를 조회하는 단계입니다. - 요청: 사용자 인증 (UserPrincipal) - 처리: GroupProxyUser에서 userId 기반 그룹 정보 조회 - 반환: 개인키로 암호화된 그룹 아이디와 그룹키로 암호화된 사용자 고유 아이디 리스트
 *
 * @tags 그룹
 * @name ViewGroup1
 * @summary 그룹 메인 보기 - Step1
 * @request GET:/api/v1/group/view1
 * @secure
 */
viewGroup1: (params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/view1`,
        method: 'GET',
                        secure: true,                format: "json",        ...params,
    }),            /**
 * @description 서버에서 사용자의 퇴장 처리 혹은 방장인 경우 그룹 전체 삭제 처리합니다.
 *
 * @tags 그룹
 * @name LeaveGroup3
 * @summary 그룹 나가기 - Step3
 * @request DELETE:/api/v1/group/leave3
 * @secure
 */
leaveGroup3: (data: LeaveGroup3Request, params: RequestParams = {}) =>
    this.http.request<LeaveGroup3Response, ErrorResponse>({
        path: `/api/v1/group/leave3`,
        method: 'DELETE',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),    }

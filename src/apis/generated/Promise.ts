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

export class Promise<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

            /**
 * @description 사용자가 속한 그룹 내 확정 완료된 약속별 scheduleId 조회 - 요청: 사용자 인증 (UserPrincipal) + PromiseView4Request (encPromiseKey 리스트) - 처리: PromiseShareKey에서 encPromiseKey로 scheduleId 조회 - 반환: scheduleId 리스트
 *
 * @tags 약속
 * @name View4
 * @summary 약속 디테일 - Step4
 * @request POST:/promise/view4
 * @secure
 */
view4: (data: PromiseView4Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/view4`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 사용자가 속한 그룹 내 (정하는중 + 확정완료) 약속별 scheduleId 조회 - 요청: 사용자 인증 (UserPrincipal) + PromiseView3Request (encPromiseKey 리스트) - 처리: PromiseShareKey에서 encPromiseKey로 scheduleId 조회 - 반환: scheduleId 리스트
 *
 * @tags 약속
 * @name View3
 * @summary 약속 디테일 - Step3
 * @request POST:/promise/view3
 * @secure
 */
view3: (data: PromiseView3Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/view3`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 사용자가 속한 그룹 내 (정하는중) 약속 정보를 조회합니다. - 요청: 사용자 인증 (UserPrincipal) + Promiseview2Request (encPromiseId 리스트) - 처리: Promise, PromiseCheck 테이블에서 약속 확정 여부 조회 - 반환: 약속 정보 리스트
 *
 * @tags 약속
 * @name View2
 * @summary 약속 디테일 - Step2
 * @request POST:/promise/view2
 * @secure
 */
view2: (data: Promiseview2Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/view2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 사용자가 약속에 참여합니다. - 요청: 사용자 인증 (UserPrincipal) + JoinPromise1Request - 처리: 참여 횟수 확인 후 참여 처리 - 예외: 참여 횟수가 5회를 초과하면 JoinLimitExceededException 발생
 *
 * @tags 약속
 * @name JoinPromise1
 * @summary 약속 참여 - Step1
 * @request POST:/promise/join1
 * @secure
 */
joinPromise1: (data: JoinPromise1Request, params: RequestParams = {}) =>
    this.http.request<JoinPromise1Response, BaseResponse>({
        path: `/promise/join1`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 사용자를 약속에 초대합니다. - 요청: 사용자 인증 (UserPrincipal) + InvitePromise1Request - 처리: GroupProxyUser 테이블에서 encGroupMemberId 조회 후 반환 - 반환: encGroupKey 리스트 (InvitePromise1Response)
 *
 * @tags 약속
 * @name InvitePromise1
 * @summary 약속 초대 - Step1
 * @request POST:/promise/invite1
 * @secure
 */
invitePromise1: (data: InvitePromise1Request, params: RequestParams = {}) =>
    this.http.request<InvitePromise1Response, BaseResponse>({
        path: `/promise/invite1`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags schedule-query-controller
 * @name GetPromiseView1
 * @request POST:/promise/get
 */
getPromiseView1: (data: GetPromiseBatchReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/get`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags schedule-query-controller
 * @name GetPromiseView2
 * @request POST:/promise/get/{groupId}
 */
getPromiseView2: (groupId: string, data: GetPromiseBatchReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/get/${groupId}`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * @description 개인키로 암호화한 그룹키를 복호화 후 이전 저장한 그룹 아이디 기준으로 GroupShareKey 레코드 리스트 조회 (최종 단계). - 요청: 사용자 인증 (UserPrincipal) + CreatePromise4Request - 처리: 그룹 내 그룹원 정보 조회 - 반환: 그룹원 리스트
 *
 * @tags 약속
 * @name CreatePromise4
 * @summary 약속 만들기 - Step4
 * @request POST:/promise/create4
 * @secure
 */
createPromise4: (data: CreatePromise4Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/create4`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 개인키로 암호화한 그룹키를 복호화 후 이전 저장한 그룹 아이디 기준으로 GroupShareKey 레코드 리스트 조회. - 요청: CreatePromise3Request - 처리: 그룹 내 그룹원 정보 조회 - 반환: 그룹원 리스트
 *
 * @tags 약속
 * @name CreatePromise3
 * @summary 약속 만들기 - Step3
 * @request POST:/promise/create3
 * @secure
 */
createPromise3: (data: CreatePromise3Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/create3`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 개인키로 암호화된 그룹 아이디와 사용자 고유 아이디를 복호화하여 GroupShareKey 정보를 조회합니다. - 요청: 사용자 인증 (UserPrincipal) + CreatePromise2Request - 처리: 그룹 아이디, 사용자 고유 아이디 기준으로 GroupShareKey 조회 - 반환: 개인키로 암호화한 그룹키 리스트
 *
 * @tags 약속
 * @name CreatePromise2
 * @summary 약속 만들기 - Step2
 * @request POST:/promise/create2
 * @secure
 */
createPromise2: (data: CreatePromise2Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/create2`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 사용자 개인키로 암호화된 그룹 정보를 조회하는 단계입니다. - 요청: 사용자 인증 (UserPrincipal) + CreatePromise1Request - 처리: GroupProxyUser에서 userId 기반 그룹 정보 조회 - 반환: 개인키로 암호화된 그룹 아이디와 그룹키로 암호화된 사용자 고유 아이디 리스트
 *
 * @tags 약속
 * @name CreatePromise1
 * @summary 약속 만들기 - Step1
 * @request POST:/promise/create1
 * @secure
 */
createPromise1: (data: CreatePromise1Request, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/create1`,
        method: 'POST',
                body: data,        secure: true,        type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description 로그인한 사용자가 속한 그룹 내 약속을 조회합니다. - 요청: 사용자 인증 (UserPrincipal) - 처리: PromiseProxyUser에서 encPromiseId(개인키로 암호화된 약속 아이디) 조회 - 반환: 개인키로 암호화된 약속 아이디 리스트
 *
 * @tags 약속
 * @name View1
 * @summary 약속 디테일 - Step1
 * @request GET:/promise/view1
 * @secure
 */
view1: (params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/promise/view1`,
        method: 'GET',
                        secure: true,                format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags schedule-query-controller
 * @name SearchPromiseView
 * @request GET:/promise/search
 */
searchPromiseView: (query: {
    query: string,
    filter?: (string)[],

}, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/search`,
        method: 'GET',
        query: query,                                        ...params,
    }),            /**
 * No description
 *
 * @tags 약속
 * @name GetUsersByPromiseTime2
 * @request GET:/promise/mem/s2/{promiseId}
 */
getUsersByPromiseTime2: (promiseId: string, data: UserIdsResDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/mem/s2/${promiseId}`,
        method: 'GET',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags 약속
 * @name GetUsersByPromiseTime1
 * @request GET:/promise/mem/s1/{promiseId}
 */
getUsersByPromiseTime1: (promiseId: string, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/mem/s1/${promiseId}`,
        method: 'GET',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags schedule-query-controller
 * @name GetPromiseDetailView
 * @request GET:/promise/get/{scheduleId}/detail
 */
getPromiseDetailView: (scheduleId: string, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/get/${scheduleId}/detail`,
        method: 'GET',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags 약속
 * @name ExitPromise
 * @request GET:/promise/exit
 */
exitPromise: (data: ExitPromiseReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/promise/exit`,
        method: 'GET',
                body: data,                type: ContentType.Json,                ...params,
    }),    }

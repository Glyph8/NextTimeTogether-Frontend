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

export class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

            /**
 * @description 회원가입을 진행한다
 *
 * @tags 인증
 * @name SignUp
 * @summary 회원가입
 * @request POST:/auth/sign-up
 */
signUp: (data: UserSignUpDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/auth/sign-up`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * @description 액세스 토큰을 재발급한다
 *
 * @tags 인증
 * @name ReissueToken
 * @summary 액세스 토큰 재발급
 * @request POST:/auth/refresh
 * @secure
 */
reissueToken: (params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/auth/refresh`,
        method: 'POST',
                        secure: true,                        ...params,
    }),            /**
 * @description 소셜 로그인을 진행한다
 *
 * @tags 인증
 * @name Login
 * @summary 소셜 로그인
 * @request POST:/auth/oauth2/login
 */
login: (data: OAuth2LoginReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/auth/oauth2/login`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * @description 소셜 로그인 시 사용자의 추가정보를 입력한다
 *
 * @tags 인증
 * @name SignUp1
 * @summary 소셜 로그인 회원가입
 * @request POST:/auth/oauth2/login/detail
 */
signUp1: (data: OAuth2LoginDetailReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/auth/oauth2/login/detail`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * @description 로그아웃한다
 *
 * @tags 인증
 * @name Logout
 * @summary 로그아웃
 * @request POST:/auth/logout
 * @secure
 */
logout: (params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/auth/logout`,
        method: 'POST',
                        secure: true,                        ...params,
    }),            /**
 * @description 일반 로그인을 진행한다
 *
 * @tags 인증
 * @name Login1
 * @summary 일반 로그인
 * @request POST:/auth/login
 */
login1: (data: LoginReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponse, ErrorResponse>({
        path: `/auth/login`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags auth-check-controller
 * @name CheckDuplicateId
 * @request POST:/auth/check/id
 */
checkDuplicateId: (data: UserIdDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseString, any>({
        path: `/auth/check/id`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags 인증
 * @name RestDocsTestApi
 * @request GET:/auth/restDocsTest
 */
restDocsTestApi: (params: RequestParams = {}) =>
    this.http.request<TestDTO, any>({
        path: `/auth/restDocsTest`,
        method: 'GET',
                                        format: "json",        ...params,
    }),            /**
 * No description
 *
 * @tags 인증
 * @name RestDocsTestParameterApi
 * @request GET:/auth/restDocsTest/{id}
 */
restDocsTestParameterApi: (id: number, params: RequestParams = {}) =>
    this.http.request<TestDTO, any>({
        path: `/auth/restDocsTest/${id}`,
        method: 'GET',
                                        format: "json",        ...params,
    }),    }

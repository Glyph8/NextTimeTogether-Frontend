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

export class Time<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

            /**
 * No description
 *
 * @tags time-controller
 * @name ViewTimeBoard
 * @request GET:/time/{promiseId}
 */
viewTimeBoard: (promiseId: string, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/time/${promiseId}`,
        method: 'GET',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags time-controller
 * @name ViewUsersByTime
 * @request POST:/time/{promiseId}
 */
viewUsersByTime: (promiseId: string, data: TimeSlotReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/time/${promiseId}`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags time-controller
 * @name UpdateUserTime
 * @request POST:/time/my/{promiseId}
 */
updateUserTime: (promiseId: string, data: UserTimeSlotReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/time/my/${promiseId}`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags time-controller
 * @name ConfirmDateTime
 * @request POST:/time/confirm/{promiseId}
 */
confirmDateTime: (promiseId: string, data: string, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/time/confirm/${promiseId}`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags time-controller
 * @name LoadUserSchedule
 * @request GET:/time/my/schedule/{promiseId}
 */
loadUserSchedule: (promiseId: string, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/time/my/schedule/${promiseId}`,
        method: 'GET',
                                                ...params,
    }),    }

export interface PopbillCardRegistrationStartRequest {
  userUuid: string;
  // 추후 Popbill에 전달할 추가 식별자/메타데이터 확장 가능
}

export interface PopbillCardRegistrationStartResponse {
  requestId: string;
  nextActionUrl: string;
  expiresAt: string;
}

export interface PopbillCardLimitResponse {
  // Popbill에서 제공 가능하다면 실제 카드 한도
  limitAmount?: number;
  // 제공 불가/미지원 시 서버에서 추정치로 채움
  estimatedRemainingAmount?: number;
  basisMessage?: string;
}

export interface PopbillClient {
  startCardRegistration(
    req: PopbillCardRegistrationStartRequest,
  ): Promise<PopbillCardRegistrationStartResponse>;

  getCardLimit(
    userUuid: string,
    paymentMethodSeq: bigint,
  ): Promise<PopbillCardLimitResponse>;
}

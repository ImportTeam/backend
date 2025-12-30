import {
  PopbillCardLimitResponse,
  PopbillCardRegistrationStartRequest,
  PopbillCardRegistrationStartResponse,
  PopbillClient,
} from './popbill.client';

export class PopbillClientStub implements PopbillClient {
  async startCardRegistration(
    req: PopbillCardRegistrationStartRequest,
  ): Promise<PopbillCardRegistrationStartResponse> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    // 실제 연동 시에는 Popbill의 카드 등록 페이지(또는 본인인증/약관 동의 등)로 리다이렉트할 URL을 반환하도록 교체합니다.
    return {
      requestId: `popbill_stub_${req.userUuid}_${now.getTime()}`,
      nextActionUrl: 'https://example.com/popbill/card-registration (stub)',
      expiresAt: expiresAt.toISOString(),
    };
  }

  async getCardLimit(
    _userUuid: string,
    paymentMethodSeq: bigint,
  ): Promise<PopbillCardLimitResponse> {
    // Popbill에서 한도 조회가 불가능할 수 있으므로, 현재 단계에서는 더미 응답을 반환합니다.
    // 추후 실제 한도 조회가 가능해지면 limitAmount를 채우고, 그렇지 않으면 estimatedRemainingAmount만 제공하도록 확장합니다.
    return {
      limitAmount: 5000000,
      estimatedRemainingAmount: 3500000,
      basisMessage: `Popbill 한도 조회 더미 응답입니다. (paymentMethodSeq=${paymentMethodSeq.toString()})`,
    };
  }
}

import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/swagger-responses.dto';

@ApiTags('본인 인증')
@ApiExtraModels(ErrorResponseDto)
@ApiBearerAuth()
@Controller('identity-verifications')
export class IdentityVerificationsTestController {
  constructor(private readonly configService: ConfigService) {}

  @Get('test')
  @ApiOperation({ summary: '본인인증 테스트 페이지', description: '브라우저에서 PASS/ImpUid 인증 테스트를 위한 간단한 HTML 페이지를 반환합니다. 개발/테스트 용도로만 사용하세요.' })
  @ApiResponse({ status: 200, description: 'HTML 테스트 페이지 반환 (Content-Type: text/html)' })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  getTestPage(@Res() res: Response) {
    const impMerchant = this.configService.get<string>('PORTONE_IMP_MERCHANT_ID') || this.configService.get<string>('PORTONE_STORE_ID') || 'imp00000000';
    const pgProvider = this.configService.get<string>('PORTONE_PG_PROVIDER') || 'inicis_unified';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>PASS / ImpUid 인증 테스트</title>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.iamport.kr/v1/iamport.js"></script>
      </head>
      <body style="display:flex; align-items:center; justify-content:center; height:100vh; background:#fafafa;">
        <div style="width:640px; padding:48px; background:white; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.08); font-family:Arial, Helvetica, sans-serif;">
          <h1 style="font-size:20px; margin:0 0 16px 0;">PASS / imp_uid 인증 테스트</h1>
          <p style="margin:0 0 24px 0; color:#444;">가맹점 식별코드(merchant id) : <strong>${impMerchant}</strong></p>

          <div style="display:flex; gap:8px; margin-bottom:18px; align-items:center">
            <input id="jwtToken" type="text" placeholder="JWT 토큰 입력(선택)" style="flex:1; padding:8px; border-radius:6px; border:1px solid #ddd" />
            <button onclick="requestCert()" style="padding:12px 18px; border-radius:6px; background:#2b7cff; color:white; border:none; cursor:pointer">인증 시작</button>
          </div>
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
            <input id="impUidDirect" type="text" placeholder="imp_uid 직접입력(테스트용)" style="flex:1; padding:8px; border-radius:6px; border:1px solid #ddd" />
            <button onclick="sendImpUidDirect()" style="padding:12px 18px; border-radius:6px; background:#666; color:white; border:none; cursor:pointer">imp_uid 직전송</button>
          </div>

          <pre id="result" style="height:240px; overflow:auto; margin-top:24px; padding:12px; background:#f7f7f7; border-radius:6px;">결과가 이곳에 표시됩니다...</pre>
        </div>

        <script>
          function requestCert() {
            const resultEl = document.getElementById('result');
            // Debug: check IMP (iamport) availability
            if (!window.IMP) {
              resultEl.innerText = 'ERROR: IMP (iamport.js) not loaded. Check network or CSP.';
              return;
            }
            if (!window.IMP.certification) {
              resultEl.innerText = 'ERROR: IMP.certification not available. Ensure correct SDK version.';
              return;
            }
            const IMP = window.IMP; // iamport global
            IMP.init('${impMerchant}');

            IMP.certification({
              // PG는 사용하는 가맹점/PG사에 따라 달라집니다. 환경변수 PORTONE_PG_PROVIDER로 설정 가능
              pg: '${pgProvider}',
              merchant_uid: 'test_' + new Date().getTime(),
              popup: true,
            }, function(rsp) {
              const resultEl = document.getElementById('result');
              if (rsp.success) {
                resultEl.innerText = '인증 성공: imp_uid=' + rsp.imp_uid + '\n\n서버로 imp_uid를 전송하여 검증합니다...';

                const token = document.getElementById('jwtToken').value;
                fetch('/api/identity-verifications/certified', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
                  },
                  body: JSON.stringify({ impUid: rsp.imp_uid })
                })
                .then(r => r.json())
                .then(data => {
                  resultEl.innerText += '\n\n서버 검증 결과:\n' + JSON.stringify(data, null, 2);
                })
                .catch(err => {
                  resultEl.innerText += '\n\n서버 검증 에러:\n' + err;
                });
                };
              }

              function sendImpUidDirect() {
                const direct = (document.getElementById('impUidDirect') as HTMLInputElement).value;
                const token = document.getElementById('jwtToken').value;
                if (!direct) {
                  resultEl.innerText = 'imp_uid를 입력하세요';
                  return;
                }
                resultEl.innerText = '직전송 imp_uid=' + direct + '\n서버로 전송 중...';

                fetch('/api/identity-verifications/certified', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) },
                  body: JSON.stringify({ impUid: direct }),
                })
                  .then(r => r.json())
                  .then(d => { resultEl.innerText += '\n\n서버 응답:\n' + JSON.stringify(d, null, 2) })
                  .catch(e => { resultEl.innerText += '\n\n직전송 에러:\n' + e })
              }
              } else {
                resultEl.innerText = '인증 실패: ' + JSON.stringify(rsp);
              }
            });
          }
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}

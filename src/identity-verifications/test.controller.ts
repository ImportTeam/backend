import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('identity-verifications')
export class IdentityVerificationsTestController {
  constructor(private readonly configService: ConfigService) {}

  @Get('test')
  getTestPage(@Res() res: Response) {
    const storeId = this.configService.get<string>('PORTONE_STORE_ID') || 'imp00000000';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>PASS / ImpUid 인증 테스트</title>
        <script src="https://cdn.iamport.kr/v1/iamport.js"></script>
      </head>
      <body style="display:flex; align-items:center; justify-content:center; height:100vh; background:#fafafa;">
        <div style="width:640px; padding:48px; background:white; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.08); font-family:Arial, Helvetica, sans-serif;">
          <h1 style="font-size:20px; margin:0 0 16px 0;">PASS / imp_uid 인증 테스트</h1>
          <p style="margin:0 0 24px 0; color:#444;">가맹점 식별코드(merchant id) : <strong>${storeId}</strong></p>

          <div style="display:flex; gap:8px; margin-bottom:18px; align-items:center">
            <input id="jwtToken" type="text" placeholder="JWT 토큰 입력(선택)" style="flex:1; padding:8px; border-radius:6px; border:1px solid #ddd" />
            <button onclick="requestCert()" style="padding:12px 18px; border-radius:6px; background:#2b7cff; color:white; border:none; cursor:pointer">인증 시작</button>
          </div>

          <pre id="result" style="height:240px; overflow:auto; margin-top:24px; padding:12px; background:#f7f7f7; border-radius:6px;">결과가 이곳에 표시됩니다...</pre>
        </div>

        <script>
          function requestCert() {
            const IMP = window.IMP; // iamport global
            IMP.init('${storeId}');

            IMP.certification({
              // PG는 사용하는 가맹점/PG사에 따라 달라집니다. 테스트용으로 기본 설정을 쓰되 필요하면 변경하세요.
              pg: 'inicis_unified',
              merchant_uid: 'test_' + new Date().getTime(),
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

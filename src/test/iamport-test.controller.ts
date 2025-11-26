import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PortOneService } from '../portone/portone.service';

@Controller('test/identity-verifications')
export class IamportTestController {
  constructor(
    private readonly configService: ConfigService,
    private readonly portOneService: PortOneService,
  ) {}

  @Get()
  getTestPage(@Res() res: Response) {
    const impMerchant = this.configService.get<string>('PORTONE_IMP_MERCHANT_ID') || this.configService.get<string>('PORTONE_STORE_ID') || 'imp00000000';
    const pgProvider = this.configService.get<string>('PORTONE_PG_PROVIDER') || 'inicis_unified';

    const html = `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>iamport test</title>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="https://cdn.iamport.kr/v1/iamport.js"></script>
      <style>body{font-family:Arial,Helvetica,sans-serif;background:#fafafa} .card{width:640px;padding:32px;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.08);margin:40px auto}</style>
    </head>
    <body>
      <div class="card">
        <h1>iamport / PASS 테스트</h1>
        <p>가맹점: ${impMerchant}</p>
        <div style="margin-bottom:8px">
          <input id="impUidDirect" placeholder="imp_uid 직접입력(테스트용)" style="padding:6px; min-width:320px"/>
          <button id="sendBtn" style="margin-left:6px">직전송</button>
        </div>
        <button id="startBtn">인증 시작</button>
        <pre id="out" style="background:#f7f7f7;padding:12px;border-radius:6px;margin-top:12px">결과 위치</pre>
      </div>

      <script>
        document.getElementById('startBtn').addEventListener('click', function(){
          const out = document.getElementById('out');
          if (!window.IMP || !window.IMP.certification) { out.innerText = 'iamport.js not loaded or certification missing'; return; }
          IMP.init('${impMerchant}');
          IMP.certification({ pg: '${pgProvider}', merchant_uid: 'test_' + Date.now(), popup:true }, function(rsp){
            out.innerText = JSON.stringify(rsp, null, 2);
            if (rsp && rsp.success) {
              // Use the test public endpoint so no JWT required for quick testing
              fetch('/api/test/identity-verifications/certified', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ impUid: rsp.imp_uid })
              }).then(r=>r.json()).then(d => { out.innerText += '\n\n서버 결과:\n' + JSON.stringify(d, null, 2) }).catch(e => { out.innerText += '\n\n서버 에러:\n' + e });
            }
          });
        });

        document.getElementById('sendBtn').addEventListener('click', function(){
          const val = document.getElementById('impUidDirect').value;
          const out = document.getElementById('out');
          if(!val){ out.innerText = 'imp_uid 입력필요'; return }
          out.innerText = '직전송 중...';
          fetch('/api/test/identity-verifications/certified', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ impUid: val }) }).then(r => r.json()).then(d => { out.innerText = '서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { out.innerText = 'err:' + e });
        });
      </script>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  @Post('certified')
  async getCertificationByImpUid(@Body('impUid') impUid: string) {
    if (!impUid) return { error: 'impUid is required' };
    const info = await this.portOneService.getCertificationByImpUid(impUid);
    return { ok: true, info };
  }

  @Post('verify-pass')
  async verifyPass(@Body('returnedIdentityId') returnedIdentityId: string) {
    if (!returnedIdentityId) return { error: 'returnedIdentityId is required' };
    const result = await this.portOneService.verifyPassIdentity(returnedIdentityId);
    return { ok: true, result };
  }
}

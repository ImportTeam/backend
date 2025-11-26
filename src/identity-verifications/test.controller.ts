import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

// Move to a dev-only test path to avoid colliding with `/identity-verifications/:portoneId`.
// Use /api/test/identity-verifications/ui instead.
@Controller('test/identity-verifications/ui')
export class IdentityVerificationsTestController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getTestPage(@Res() res: Response) {
    const impMerchant = this.configService.get<string>('PORTONE_IMP_MERCHANT_ID') || this.configService.get<string>('PORTONE_STORE_ID') || 'imp00000000';
    const pgProvider = this.configService.get<string>('PORTONE_PG_PROVIDER') || 'inicis_unified';

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>PASS / ImpUid 인증 테스트</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.iamport.kr/v1/iamport.js"></script>
  <style>body{font-family:Arial,Helvetica,sans-serif;background:#fafafa} .card{width:640px;padding:48px;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.08);margin:56px auto}</style>
</head>
<body>
  <div class="card">
      <div id="debug" style="margin-bottom:12px;padding:8px;background:#fff3cd;border-radius:6px;color:#856404">로딩 중...</div>
    <h1 style="font-size:20px;margin:0 0 16px 0">PASS / imp_uid 인증 테스트</h1>
    <p style="margin:0 0 24px 0;color:#444">가맹점 식별코드(merchant id) : <strong>${impMerchant}</strong></p>

    <div style="display:flex;gap:8px;margin-bottom:18px;align-items:center">
      <input id="jwtToken" type="text" placeholder="JWT 토큰 입력(선택)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #ddd" />
      <button id="startCert" style="padding:12px 18px;border-radius:6px;background:#2b7cff;color:#fff;border:none;cursor:pointer">인증 시작</button>
    </div>

    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <input id="impUidDirect" type="text" placeholder="imp_uid 직접입력(테스트용)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #ddd" />
      <button id="sendDirect" style="padding:12px 18px;border-radius:6px;background:#666;color:#fff;border:none;cursor:pointer">imp_uid 직전송</button>
    </div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <input id="returnedIdentityId" type="text" placeholder="returnedIdentityId (PASS)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #ddd" />
          <button id="sendPass" style="padding:12px 18px;border-radius:6px;background:#198754;color:#fff;border:none;cursor:pointer">PASS 직전송</button>
        </div>

    <pre id="result" style="height:240px;overflow:auto;margin-top:24px;padding:12px;background:#f7f7f7;border-radius:6px">결과가 이곳에 표시됩니다...</pre>
  </div>

      <script>
    (function(){
      // minor helper: update debug area
      function setDebug(msg){ try{ document.getElementById('debug').innerText = msg }catch(e){} }
      const impMerchant = '${impMerchant}';
      const pgProvider = '${pgProvider}';
      const resultEl = document.getElementById('result');
      setDebug('merchant=' + impMerchant + '  pg=' + pgProvider);

      function append(text){ resultEl.innerText = resultEl.innerText + '\n' + text }

      // Global onerror: show script errors at the bottom of the UI (useful to spot extension or third-party issues)
      window.addEventListener('error', function(ev){
        try {
          const out = document.getElementById('result');
          out.innerText += '\n\nGlobalError: ' + (ev?.message || String(ev));
        } catch(e) { /* ignore */ }
      });

      document.getElementById('startCert').addEventListener('click', function(){
        resultEl.innerText = 'iamport 인증 시작...';
        try {
          if (!window.IMP) {
            setDebug('IMP SDK not loaded. Check network or disable extensions.');
            resultEl.innerText = 'ERROR: IMP (iamport.js) not loaded. 새로고침 또는 확장 프로그램을 비활성화하세요.';
            return;
          }
          if (!window.IMP.certification) {
            setDebug('IMP loaded but certification api missing. Possibly blocked by extension.');
            resultEl.innerText = 'ERROR: IMP.certification not available. 브라우저 확장이나 CSP를 확인하세요.';
          return;
        }
        } catch (err) {
          resultEl.innerText = 'ERROR while checking IMP: ' + (err?.message || String(err));
          return;
        }

        const IMP = window.IMP;
        IMP.init(impMerchant);
        try {
          // Detect if popup blocked: open blank window first and pass as popup
          try {
            const win = window.open('about:blank', '_blank');
            if (win && win.closed === false) {
              // Immediately close; this is just a popup-blocker heuristic
              win.close();
              setDebug('팝업 허용: iamport 인증 시 팝업 사용 예정');
            } else {
              setDebug('팝업 차단 가능: 브라우저가 팝업을 차단할 수 있습니다. 팝업을 허용하세요.');
            }
          } catch (e) {
            setDebug('팝업 체크 중 오류 발생 - 팝업 허용을 확인하세요');
          }

          IMP.certification({ pg: pgProvider, merchant_uid: 'test_' + Date.now(), popup: true }, function(rsp){
          if (rsp && rsp.success) {
            resultEl.innerText = '인증 성공: imp_uid=' + rsp.imp_uid + '\n\n서버로 imp_uid 전송...';
            if (!/^imp(s)?_/.test(rsp.imp_uid)) {
              resultEl.innerText += '\n\n경고: imp_uid 형식이 올바르지 않습니다 — 가맹점 ID가 전달된 것일 수 있습니다. imp_uid 는 imp_ 또는 imps_ 로 시작해야 합니다.';
            }
            const token = document.getElementById('jwtToken').value;
            if (token) {
              const endpoint = '/api/identity-verifications/certified';
              fetch(endpoint, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
                body: JSON.stringify({ impUid: rsp.imp_uid })
              }).then(r => r.json()).then(d => { resultEl.innerText += '\n\n서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { resultEl.innerText += '\n\n서버 에러:\n' + e })
            } else {
              // Public GET test endpoint
              const endpoint = '/api/identity-verifications/certified/test?impUid=' + encodeURIComponent(rsp.imp_uid);
              fetch(endpoint, { method: 'GET' }).then(r => r.json()).then(d => { resultEl.innerText += '\n\n공개 서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { resultEl.innerText += '\n\n서버 에러:\n' + e })
            }
            } else {
            resultEl.innerText = '인증 실패: ' + JSON.stringify(rsp);
          }
          });
        } catch (err) {
          resultEl.innerText = 'IMP.certification threw an error: ' + (err?.message || String(err));
        }
        });
      });

      document.getElementById('sendDirect').addEventListener('click', function(){
        const direct = document.getElementById('impUidDirect').value;
        const token = document.getElementById('jwtToken').value;
        if (!direct) { resultEl.innerText = 'imp_uid를 입력하세요'; return }
        if (!/^imp(s)?_/.test(direct)) { resultEl.innerText = '유효하지 않은 imp_uid 형식입니다. imp_ 또는 imps_ 로 시작해야 합니다.'; return }
        resultEl.innerText = '직전송 imp_uid=' + direct + '\n서버로 전송 중...';
        if (token) {
          const endpoint = '/api/identity-verifications/certified';
          fetch(endpoint, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
              body: JSON.stringify({ impUid: direct })
          }).then(r => r.json()).then(d => { resultEl.innerText += '\n\n서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { resultEl.innerText += '\n\n직전송 에러:\n' + e })
        } else {
          const endpoint = '/api/identity-verifications/certified/test?impUid=' + encodeURIComponent(direct);
          fetch(endpoint, { method: 'GET' }).then(r => r.json()).then(d => { resultEl.innerText += '\n\n공개 서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { resultEl.innerText += '\n\n직전송 에러:\n' + e })
        }
      });

      document.getElementById('sendPass').addEventListener('click', function(){
        const returned = document.getElementById('returnedIdentityId').value;
        const out = document.getElementById('result');
        if (!returned) { out.innerText = 'returnedIdentityId를 입력하세요'; return }
        out.innerText = 'PASS returnedIdentityId 직전송 중...';

        // call public test endpoint if no JWT
        const token = document.getElementById('jwtToken').value;
        if (token) {
          const endpoint = '/api/identity-verifications/verify';
          fetch(endpoint, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
            body: JSON.stringify({ returnedIdentityId: returned })
          }).then(r => r.json()).then(d => { out.innerText = '서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { out.innerText = 'err:' + e });
        } else {
          const endpoint = '/api/identity-verifications/verify-pass/test?returnedIdentityId=' + encodeURIComponent(returned);
          fetch(endpoint, { method: 'GET' }).then(r => r.json()).then(d => { out.innerText = '서버 응답:\n' + JSON.stringify(d, null, 2) }).catch(e => { out.innerText = 'err:' + e });
        }
      });
    })();
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}

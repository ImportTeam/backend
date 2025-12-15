import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpointInProd } from '../common/swagger/api-exclude-endpoint-in-prod.decorator';

@ApiTags('테스트')
@Controller('test/identity-verifications')
export class IamportTestController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiExcludeEndpointInProd()
  getTestPage(@Res() res: Response): Response {
    const impMerchant =
      this.configService.get<string>('PORTONE_IMP_MERCHANT_ID') ||
      this.configService.get<string>('PORTONE_STORE_ID') ||
      'imp00000000';
    const pgProvider =
      this.configService.get<string>('PORTONE_PG_PROVIDER') || 'inicis_unified';

    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>IAMPORT TEST</title><script src="https://code.jquery.com/jquery-3.6.0.min.js"></script><script src="https://cdn.iamport.kr/v1/iamport.js"></script></head><body><h2>IAMPORT / PASS 테스트</h2><p>가맹점: ${impMerchant}</p><div style="margin-bottom:8px"><input id="impUidDirect" placeholder="imp_uid 직접입력(테스트용)" style="padding:6px; min-width:320px"/> <button onclick="sendImpUidDirect();" style="margin-left:6px">직전송</button></div><button onclick="doImpCert()">인증 시작</button><script>function doImpCert(){ try{ if(!window.IMP){alert('IMP SDK 로드 실패. 네트워크 여부 확인');return;} IMP.init('${impMerchant}'); IMP.certification({pg: '${pgProvider}', merchant_uid:'test_'+Date.now(), popup: true},(rsp)=>{if(rsp.success){ fetch('/api/identity-verifications/certified',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({impUid:rsp.imp_uid})}).then(r=>r.json()).then(d=>alert(JSON.stringify(d))).catch(e=>alert('err:'+e)); } else { alert('인증 실패: '+rsp.error_msg); } }); } catch(e){ alert('JS 에러: '+e.message); } } function sendImpUidDirect(){ const val=document.getElementById('impUidDirect').value; if(!val){alert('imp_uid 입력필요');return;} fetch('/api/identity-verifications/certified',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({impUid:val})}).then(r=>r.json()).then(d=>alert(JSON.stringify(d))).catch(e=>alert('err:'+e)); }</script></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}

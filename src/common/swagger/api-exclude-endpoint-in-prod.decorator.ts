import { ApiExcludeEndpoint } from '@nestjs/swagger';

type MethodDecoratorFn = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => void;

const noop: MethodDecoratorFn = () => {
  return;
};

/**
 * Swagger 문서에서 내부/개발용 엔드포인트를 숨깁니다.
 * - 기본: production에서만 숨김
 * - 예외: SWAGGER_SHOW_INTERNAL=true 이면 production에서도 노출
 */
export function ApiExcludeEndpointInProd(): MethodDecorator {
  const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
  const showInternal =
    (process.env.SWAGGER_SHOW_INTERNAL || '').toLowerCase() === 'true';

  if (isProd && !showInternal) {
    return ApiExcludeEndpoint();
  }

  return noop;
}

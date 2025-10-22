// 전역 BigInt -> JSON 문자열화
// eslint-disable-next-line no-extend-native
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

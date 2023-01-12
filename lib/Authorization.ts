const authRegex = /^Bearer /i;

export class Authorization {
  // constructor() {}

  static check(token?: string): string {
    try {
      if (!token || token.replace(authRegex, '')) {
        throw 'Authorization 토큰 정보가 없습니다.';
      }
      return token;
    } catch (e) {
      return e as string;
    }
  }
}

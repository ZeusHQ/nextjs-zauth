import { BaseConfig, NextConfig, getConfig } from '../src/config';

const getConfigWithEnv = (env: any = {}, opts?: any): { baseConfig: BaseConfig; nextConfig: NextConfig } => {
  const bkp = process.env;
  process.env = {
    ...process.env,
    ...{
      ZAUTH_SECRET: '__long_super_secret_secret__',
      ZAUTH_ISSUER_BASE_URL: 'https://example.identity.zeusdev.io',
      ZAUTH_BASE_URL: 'https://example.com',
      ZAUTH_CLIENT_ID: '__test_client_id__',
      ZAUTH_CLIENT_SECRET: '__test_client_secret__'
    },
    ...env
  };
  try {
    return getConfig(opts);
  } catch (e) {
    throw e;
  } finally {
    process.env = bkp;
  }
};

describe('config params', () => {
  test('should return an object from empty defaults', () => {
    const { baseConfig, nextConfig } = getConfigWithEnv();
    expect(baseConfig).toStrictEqual({
      secret: '__long_super_secret_secret__',
      issuerBaseURL: 'https://example.identity.zeusdev.io',
      baseURL: 'https://example.com',
      clientID: '__test_client_id__',
      clientSecret: '__test_client_secret__',
      clockTolerance: 60,
      httpTimeout: 5000,
      enableTelemetry: true,
      idpLogout: true,
      zAuthLogout: true,
      idTokenSigningAlg: 'RS256',
      legacySameSiteCookie: true,
      authorizationParams: {
        response_type: 'code',
        audience: undefined,
        scope: 'openid profile email'
      },
      session: {
        name: 'appSession',
        rolling: true,
        rollingDuration: 86400,
        absoluteDuration: 604800,
        cookie: {
          domain: undefined,
          path: '/',
          transient: false,
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        }
      },
      routes: { callback: '/api/auth/callback', postLogoutRedirect: '' },
      getLoginState: expect.any(Function),
      identityClaimFilter: [
        'aud',
        'iss',
        'iat',
        'exp',
        'nbf',
        'nonce',
        'azp',
        'auth_time',
        's_hash',
        'at_hash',
        'c_hash'
      ],
      clientAuthMethod: 'client_secret_basic'
    });
    expect(nextConfig).toStrictEqual({
      identityClaimFilter: [
        'aud',
        'iss',
        'iat',
        'exp',
        'nbf',
        'nonce',
        'azp',
        'auth_time',
        's_hash',
        'at_hash',
        'c_hash'
      ],
      routes: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        postLogoutRedirect: ''
      },
      organization: undefined
    });
  });

  test('should populate booleans', () => {
    expect(
      getConfigWithEnv({
        ZAUTH_ENABLE_TELEMETRY: 'off',
        ZAUTH_LEGACY_SAME_SITE_COOKIE: '0',
        ZAUTH_IDP_LOGOUT: 'no',
        ZAUTH_COOKIE_TRANSIENT: true,
        ZAUTH_COOKIE_HTTP_ONLY: 'on',
        ZAUTH_COOKIE_SAME_SITE: 'lax',
        ZAUTH_COOKIE_SECURE: 'ok',
        ZAUTH_SESSION_ABSOLUTE_DURATION: 'no'
      }).baseConfig
    ).toMatchObject({
      zAuthLogout: false,
      enableTelemetry: false,
      idpLogout: false,
      legacySameSiteCookie: false,
      session: {
        absoluteDuration: false,
        cookie: {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          transient: true
        }
      }
    });
  });

  test('should populate numbers', () => {
    expect(
      getConfigWithEnv({
        ZAUTH_CLOCK_TOLERANCE: '100',
        ZAUTH_HTTP_TIMEOUT: '9999',
        ZAUTH_SESSION_ROLLING_DURATION: '0',
        ZAUTH_SESSION_ABSOLUTE_DURATION: '1'
      }).baseConfig
    ).toMatchObject({
      clockTolerance: 100,
      httpTimeout: 9999,
      session: {
        rolling: true,
        rollingDuration: 0,
        absoluteDuration: 1
      }
    });
  });

  test('passed in arguments should take precedence', () => {
    const { baseConfig, nextConfig } = getConfigWithEnv(
      {
        ZAUTH_ORGANIZATION: 'foo'
      },
      {
        authorizationParams: {
          audience: 'foo',
          scope: 'openid bar'
        },
        baseURL: 'https://baz.com',
        routes: {
          callback: 'qux'
        },
        session: {
          absoluteDuration: 100,
          cookie: {
            transient: false
          },
          name: 'quuuux'
        },
        organization: 'bar'
      }
    );
    expect(baseConfig).toMatchObject({
      authorizationParams: {
        audience: 'foo',
        scope: 'openid bar'
      },
      baseURL: 'https://baz.com',
      routes: {
        callback: 'qux'
      },
      session: {
        absoluteDuration: 100,
        cookie: {
          transient: false
        },
        name: 'quuuux'
      }
    });
    expect(nextConfig).toMatchObject({
      organization: 'bar'
    });
  });

  test('should allow hostnames as baseURL', () => {
    expect(
      getConfigWithEnv({
        ZAUTH_BASE_URL: 'foo.identity.zeusdev.io'
      }).baseConfig
    ).toMatchObject({
      baseURL: 'https://foo.identity.zeusdev.io'
    });
  });

  test('should accept optional callback path', () => {
    const { baseConfig, nextConfig } = getConfigWithEnv({
      ZAUTH_CALLBACK: '/api/custom-callback'
    });
    expect(baseConfig).toMatchObject({
      routes: expect.objectContaining({ callback: '/api/custom-callback' })
    });
    expect(nextConfig).toMatchObject({
      routes: expect.objectContaining({ callback: '/api/custom-callback' })
    });
  });
});

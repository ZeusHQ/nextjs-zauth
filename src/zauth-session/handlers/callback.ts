import { IncomingMessage, ServerResponse } from 'http';
import urlJoin from 'url-join';
import { BadRequest } from 'http-errors';
import { Config } from '../config';
import { ClientFactory } from '../client';
import TransientStore from '../transient-store';
import { decodeState } from '../hooks/get-login-state';
import { SessionCache } from '../session-cache';

function getRedirectUri(config: Config): string {
  return urlJoin(config.baseURL, config.routes.callback);
}

export type AfterCallback = (req: any, res: any, session: any, state: Record<string, any>) => Promise<any> | any;

export type CallbackOptions = {
  afterCallback?: AfterCallback;

  redirectUri?: string;
};

export type HandleCallback = (req: IncomingMessage, res: ServerResponse, options?: CallbackOptions) => Promise<void>;

export default function callbackHandlerFactory(
  config: Config,
  getClient: ClientFactory,
  sessionCache: SessionCache,
  transientCookieHandler: TransientStore
): HandleCallback {
  return async (req, res, options) => {
    console.log("callbackHandlerFactory");
    const client = await getClient();
    const redirectUri = options?.redirectUri || getRedirectUri(config);

    let expectedState;
    let tokenSet;

    try {
      const callbackParams = client.callbackParams(req);
      expectedState = transientCookieHandler.read('state', req, res);
      const max_age = transientCookieHandler.read('max_age', req, res);
      const code_verifier = transientCookieHandler.read('code_verifier', req, res);
      const nonce = transientCookieHandler.read('nonce', req, res);

      console.log("expectedState");
      console.log(expectedState);
      console.log("redirectUri");
      console.log(redirectUri);
      console.log("callbackParams");
      console.log(callbackParams);


      /* TODO */
      /* 
        debug what happens here
      */
     console.log("client callback", client.callback);
      tokenSet = await client.callback(redirectUri, callbackParams, {
        max_age: max_age !== undefined ? +max_age : undefined,
        code_verifier,
        nonce,
        state: expectedState
      });

      console.log("tokenSet", tokenSet);
    } catch (err) {
      console.log("error", err)
      throw new BadRequest(err.message);
    }

    const openidState: { returnTo?: string } = decodeState(expectedState as string);
    let session = sessionCache.fromTokenSet(tokenSet);

    console.log("session")
    console.log(session);

    if (options?.afterCallback) {
      session = await options.afterCallback(req as any, res as any, session, openidState);
    }

    sessionCache.create(req, res, session);

    console.log("OPENID STATE RETURN TO");
    console.log(openidState);
    console.log(openidState.returnTo);
    console.log(config.baseURL);

    res.writeHead(302, {
      Location: openidState.returnTo || config.baseURL
    });
    res.end();
  };
}

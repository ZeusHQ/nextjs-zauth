import { GetSession, GetAccessToken } from './session';
import { WithApiAuthRequired, WithPageAuthRequired } from './helpers';
import { HandleAuth, HandleCallback, HandleLogin, HandleLogout, HandleProfile } from './handlers';
import { ConfigParameters } from './zsession';

/**
 * The SDK server instance.
 *
 * This is created for you when you use the named exports, or you can create your own using {@link InitZeusIdentity}
 *
 * See {@link Config} fro more info.
 *
 * @category Server
 */
export interface SignInWithZeusAuth {
  /**
   * Session getter
   */
  getSession: GetSession;

  /**
   * Access Token getter
   */
  getAccessToken: GetAccessToken;

  /**
   * Login handler which will redirect the user to ZeusAuth.
   */
  handleLogin: HandleLogin;

  /**
   * Callback handler which will complete the transaction and create a local session.
   */
  handleCallback: HandleCallback;

  /**
   * Logout handler which will clear the local session and the ZeusAuth session.
   */
  handleLogout: HandleLogout;

  /**
   * Profile handler which return profile information about the user.
   */
  handleProfile: HandleProfile;

  /**
   * Helper that adds auth to an API Route
   */
  withApiAuthRequired: WithApiAuthRequired;

  /**
   * Helper that adds auth to a Page Route
   */
  withPageAuthRequired: WithPageAuthRequired;

  /**
   * Create the main handlers for your api routes
   */
  handleAuth: HandleAuth;
}

/**
 * Initialise your own instance of the SDK.
 *
 * See {@link Config}
 *
 * @category Server
 */
export type InitZeusIdentity = (params?: ConfigParameters) => SignInWithZeusAuth;

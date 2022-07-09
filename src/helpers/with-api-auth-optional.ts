import { NextApiResponse, NextApiRequest, NextApiHandler } from 'next';
import { SessionCache } from '../session';
import { assertReqRes } from '../utils/assert';

/**
 * Wrap an API Route to check that the user has a valid session. If they're not logged in the handler will return a
 * 401 Unauthorized.
 *
 * ```js
 * // pages/api/protected-route.js
 * import { withApiAuthOptional, getSession } from '@zeushq/nextjs-zidentity';
 *
 * export default withApiAuthOptional(function ProtectedRoute(req, res) {
 *   const session = getSession(req, res);
 *   ...
 * });
 * ```
 *
 * If you visit `/api/protected-route` without a valid session cookie, you will get a 401 response.
 *
 * @category Server
 */
export type WithApiAuthOptional = (apiRoute: NextApiHandler) => NextApiHandler;

/**
 * @ignore
 */
export default function withApiAuthFactory(sessionCache: SessionCache): WithApiAuthOptional {
    return (apiRoute) =>
        async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
            assertReqRes(req, res);

            const session = sessionCache.get(req, res);

            if (session) {
                if ((res as any).locals === undefined) (res as any).locals = {};
                (res as any).locals.session = session;
                (res as any).locals.user = session.user;
            }

            await apiRoute(req, res);
        };
}

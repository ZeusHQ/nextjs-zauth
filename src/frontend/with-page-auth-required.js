var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useEffect } from 'react';
import { useConfig } from './use-config';
import { useUser } from './use-user';
/**
 * @ignore
 */
var defaultOnRedirecting = function () { return React.createElement(React.Fragment, null); };
/**
 * @ignore
 */
var defaultOnError = function () { return React.createElement(React.Fragment, null); };
/**
 * @ignore
 */
var withPageAuthRequired = function (Component, options) {
    if (options === void 0) { options = {}; }
    return function withPageAuthRequired(props) {
        var returnTo = options.returnTo, _a = options.onRedirecting, onRedirecting = _a === void 0 ? defaultOnRedirecting : _a, _b = options.onError, onError = _b === void 0 ? defaultOnError : _b;
        var loginUrl = useConfig().loginUrl;
        var _c = useUser(), user = _c.user, error = _c.error, isLoading = _c.isLoading;
        useEffect(function () {
            if ((user && !error) || isLoading)
                return;
            var returnToPath;
            if (!returnTo) {
                var currentLocation = window.location.toString();
                returnToPath = currentLocation.replace(new URL(currentLocation).origin, '') || '/';
            }
            else {
                returnToPath = returnTo;
            }
            window.location.assign(loginUrl + "?returnTo=" + encodeURIComponent(returnToPath));
        }, [user, error, isLoading]);
        if (error)
            return onError(error);
        if (user)
            return React.createElement(Component, __assign({ user: user }, props));
        return onRedirecting();
    };
};
export default withPageAuthRequired;
//# sourceMappingURL=with-page-auth-required.js.map
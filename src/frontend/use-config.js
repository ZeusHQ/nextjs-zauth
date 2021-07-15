import React, { useContext, createContext } from 'react';
var Config = createContext({});
export var useConfig = function () { return useContext(Config); };
export default (function (_a) {
    var children = _a.children, _b = _a.loginUrl, loginUrl = _b === void 0 ? process.env.NEXT_PUBLIC_ZAUTH_LOGIN || '/api/auth/login' : _b;
    return React.createElement(Config.Provider, { value: { loginUrl: loginUrl } }, children);
});
//# sourceMappingURL=use-config.js.map
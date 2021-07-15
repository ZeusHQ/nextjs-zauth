import createDebug, { Debugger } from 'debug';

export default (name: string): Debugger => createDebug('nextjs-zauth').extend(name);

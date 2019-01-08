// Code Mirror syntax-highlighing mode
import { getToken, State } from './lexer';

import * as CM from 'codemirror';

type TokenType =
  | 'operator'
  | 'bracket'
  | 'keyword'
  | 'variable'
  | 'number'
  | 'comment'
  | 'string'
  | 'error'


export function MakeMode(_config: CodeMirror.EditorConfiguration, _modeOptions?: any): CM.Mode<State> {
  return {
    token: (
      stream: CM.StringStream,
      state: State
    ): TokenType | null => {
      const token = getToken(stream, state);
      if (!token) {
        return null;
      }

      const type = token.type;
      switch (type) {
        case 'NUMBER':
          return 'number';

        case '(':
        case ')':
          return 'bracket';

        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
          return 'operator';

        case 'COMMENT':
          return 'comment';

        case 'ERROR':
          return 'error';

        default:
          return assertUnreachable(type);
      }
    },
    startState: () => ({
      stack: ['default' as 'default'],
      line: 0
    })
  };
}

function assertUnreachable(x: never): never {
  throw new Error(`Didn't expect to get here ${x}`);
}

CM.defineMode('test', MakeMode);

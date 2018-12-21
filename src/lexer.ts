import StringStream from './StringStream'

export function getTokens(text: string): Token[] {
  const tokens: Token[] = [];
  const state: State = { line: 1, stack: ['default'] };

  for (const line of text.split('\n')) {
    const stream = new StringStream(line);
    while (!stream.eol()) {
      const token = getToken(stream, state);
      if (token != undefined) {
        tokens.push(token);
      }

      if (stream.start == stream.pos) {
        throw new Error(
          `getToken failed to advance stream at position ${
            stream.pos
          } in string ${stream.string}`
        );
      }
      stream.start = stream.pos;
    }

    state.line += 1;
  }

  return tokens;
}

export function getToken(
  stream: StringStream,
  state: State
): Token | undefined {
  //Built for codeMirror streams API
  //State is a stack of states
  switch (state.stack[state.stack.length - 1]) {
    default:
      return getDefaultToken(stream, state);
  }
}

function makeEmit(stream: StringStream, state: State) {
  return function emitToken(type: TokenType): Token {
    return {
      type,
      first_column: stream.start,
      last_column: stream.pos,
      line: state.line,
      text: stream.current()
    };
  };
}

function getDefaultToken(
  stream: StringStream,
  state: State
): Token | undefined {
  const emitToken = makeEmit(stream, state);
  if (stream.eatSpace()) {
    // skip whitespace
    return undefined;
  }

  if (stream.match(/\+/)) {
    return emitToken('+');
  }

  if (stream.match(/\-/)) {
    return emitToken('-');
  }

  if (stream.match(/\*/)) {
    return emitToken('*');
  }

  if (stream.match(/\//)) {
    return emitToken('/');
  }

  if (stream.match(/\(/)) {
    return emitToken('(');
  }

  if (stream.match(/\)/)) {
    return emitToken(')');
  }

  if (stream.match(/=/)) {
    return emitToken('=');
  }

  if (stream.match(/,/)) {
    return emitToken(',');
  }

  if (stream.match(/>=/)) {
    return emitToken('>=');
  }

  if (stream.match(/<=/)) {
    return emitToken('<=');
  }

  if (stream.match(/>/)) {
    return emitToken('>');
  }

  if (stream.match(/</)) {
    return emitToken('<');
  }

  if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
    return emitToken('IDENTIFIER');
  }

  if (stream.match(/-?[0-9]+(\.[0-9]+)?/)) {
    return emitToken('NUMBER');
  }

  if (stream.match(/#/)) {
    if (!stream.match(/\n/)) {
      // comment lasts till end of line
      stream.match(/.*/); // if no eol encountered, comment lasts till end of file
    }
    return emitToken('COMMENT');
  }

  stream.next();
  return emitToken('ERROR');
}

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | '+'
  | '-'
  | '*'
  | '/'
  | '('
  | ')'
  | '='
  | ','
  | '>='
  | '<='
  | '>'
  | '<'
  | 'COMMENT'
  | 'ERROR';

export interface Token<T extends TokenType = TokenType> {
  type: T;
  text: string;
  line: number;
  first_column: number;
  last_column: number;
}

type Mode = 'default' | 'comment';

export interface State {
  stack: Mode[];
  line: number;
}

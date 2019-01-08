import {Token, TokenType, getTokens} from './lexer';
import {ParseError, token2pos} from './position';

export class TokenStream {
  tokens: Token[];
  pos: number = 0;

  constructor(text: string) {
    this.tokens = getTokens(text).filter(t => t.type != 'COMMENT');
  }

  consume(): Token | undefined {
    const token = this.tokens[this.pos];
    if (token) {
      this.pos += 1;
    }
    return token;
  }

  peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  last(): Token {
    return this.tokens[this.pos - 1];
  }

  expectToken<T extends TokenType>(expectedType: T): Token<T> {
    const actual = this.consume();

    if (!actual) {
      throw new ParseError(
        `Expected "${expectedType}" token but found none.`,
        token2pos(this.last()),
      );
    }

    if (actual.type != expectedType) {
      throw new ParseError(
        `Expected "${expectedType}" token type but found "${actual.type}".`,
        token2pos(actual),
      );
    }

    return actual as Token<T>;
  }
}

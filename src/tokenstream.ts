import {Token, TokenType, getTokens} from './lexer';

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
      throw new Error(
        `Expected _${expectedType}_ token but found none. ${JSON.stringify(
          this.last(),
        )}`,
      );
    }

    if (actual.type != expectedType) {
      throw new Error(
        `Expected _${expectedType}_ token but found _${
          actual.type
        }_. ${JSON.stringify(actual)}`,
      );
    }

    return actual as Token<T>;
  }
}

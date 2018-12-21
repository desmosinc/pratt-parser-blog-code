import { TokenStream } from './tokenstream';
import { Token, TokenType, BinaryOperationTokenType} from './lexer';
import * as AST from './ast';
import { AbstractParser } from './parser';
import {token2pos, join} from './position'

export interface PrefixParselet {
  parse(parser: AbstractParser, tokens: TokenStream, token: Token): AST.Node;
}

export class NumberParselet implements PrefixParselet {
  parse(_parser: AbstractParser, _tokens: TokenStream, token: Token) {
    return {
      type: 'Number' as 'Number',
      value: parseFloat(token.text),
      pos: token2pos(token)
    }
  }
}

export class BooleanParselet implements PrefixParselet {
  constructor(private value: boolean) {}
  parse(_parser: AbstractParser, _tokens: TokenStream, token: Token) {
    return {
      type: 'Boolean' as 'Boolean',
      value: this.value,
      pos: token2pos(token)
    }
  }
}

export class ParenParselet implements PrefixParselet {
  parse(parser: AbstractParser, tokens: TokenStream, _token: Token) {
    const exp = parser.parse(tokens, 0);
    tokens.expectToken(')');

    return exp;
  }
}

export abstract class InfixParselet {
  constructor(
    readonly tokenType: TokenType,
    readonly associativity: 'left' | 'right'
  ) {}
  abstract parse(
    parser: AbstractParser,
    tokens: TokenStream,
    left: AST.Node,
    token: Token
  ): AST.Node;
}

export class BinaryOperatorParselet extends InfixParselet {
  constructor(
    public tokenType: BinaryOperationTokenType,
    associativity: 'left' | 'right'
  ) {
    super(tokenType, associativity);
  }

  parse(
    parser: AbstractParser,
    tokens: TokenStream,
    left: AST.Node,
    _token: Token
  ): AST.Node {
    const precedence = parser.bindingPower(this.tokenType);

    const right = parser.parse(
      tokens,
      this.associativity == 'left' ? precedence : precedence - 1
    );

    return {
      type: 'BinaryOperation' as 'BinaryOperation',
      operator: this.tokenType,
      left,
      right,
      pos: join(left.pos, token2pos(tokens.last()))
    }
  }
}

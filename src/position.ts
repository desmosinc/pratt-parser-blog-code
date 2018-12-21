import { Token } from './lexer';

export type Position = {
  first_line: number;
  first_column: number;
  last_line: number;
  last_column: number;
};

export function token2pos(token: Token): Position {
  return {
    first_line: token.line,
    last_line: token.line,
    first_column: token.first_column,
    last_column: token.last_column
  }
}

export function join(start: Position, end: Position) {
  return {
    first_line: start.first_line,
    last_line: end.last_line,
    first_column: start.first_column,
    last_column: end.last_column
  };
}

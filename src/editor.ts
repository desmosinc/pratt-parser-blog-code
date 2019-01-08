import CM from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/lint.css'

import {ParseError} from './position'
import './mode'

export function create(
  node: HTMLElement
) {
  const editor = CM(node, {
    value: '1 + (2 + 3) / 4',
    mode: 'myMode',
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    lineWrapping: true
  });

  CM.registerHelper('lint', 'myMode', () => {
    const parseErrors: ParseError[] = editor.getOption('script-errors') || []
    return parseErrors.map((e) => ({
      from: CM.Pos(e.position.first_line - 1, e.position.first_column),
      to: CM.Pos(e.position.last_line - 1, e.position.last_column),
      message: e.message,
      severity: 'error'
    }))
  })

  return editor;
}

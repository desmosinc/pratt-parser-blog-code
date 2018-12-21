import CM from 'codemirror';
import '../node_modules/codemirror/lib/codemirror.css';
import './mode'

export function create(
  node: HTMLElement
) {
  const editor = CM(node, {
    value: '1 + (2 + 3) / 4',
    mode: 'test',
    lineWrapping: true
  });

  return editor;
}

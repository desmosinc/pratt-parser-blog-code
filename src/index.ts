import {getTokens} from './lexer';
import {create} from './editor';
import {parse} from './parser';

const cmContainer = document.createElement('div');
cmContainer.className = 'cm-container';
document.body.appendChild(cmContainer);
const cm = create(cmContainer);

const outputContainer = document.createElement('pre');
outputContainer.className = 'output-container';
document.body.appendChild(outputContainer);

function updateOutput() {
  const ast = parse(cm.getDoc().getValue());
  cm.setOption('script-errors', ast.errors);

  const tokens = getTokens(cm.getDoc().getValue());
  outputContainer.innerHTML = `\
ast: ${JSON.stringify(ast, null, 2)}
tokens: ${JSON.stringify(tokens, null, 2)}`;
}

cm.on('change', updateOutput);
updateOutput();

import {getTokens} from './lexer'
import {create} from './editor'

const cmContainer = document.createElement('div')
cmContainer.className = "cm-container"
document.body.appendChild(cmContainer)
const cm = create(cmContainer)

const outputContainer = document.createElement('pre')
outputContainer.className = "output-container"
document.body.appendChild(outputContainer)

function updateOutput() {
  const tokens = getTokens(cm.getDoc().getValue())
  outputContainer.innerHTML = 'tokens: ' + JSON.stringify(tokens, null, 2)
}

cm.on('change', updateOutput);
updateOutput()

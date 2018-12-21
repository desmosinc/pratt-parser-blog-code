import {getTokens} from './lexer'
import {create} from './editor'

console.log(getTokens('1 + 2 * (3 / 4)'))

create(document.body)

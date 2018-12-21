import {StringStream as StringStreamI} from 'codemirror'

// interface merging to expose StringStream as a class
// https://github.com/Microsoft/TypeScript/issues/340
interface StringStream extends StringStreamI {}
declare class StringStream {
  constructor(line: string)
}

export default StringStream

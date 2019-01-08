# pratt-parser-blog-code

This project implements a lexer and Pratt parser for a simple language.

It also creates a CodeMirror mode, `myMode`, that provides syntax highliting based on the lexer, and linting for parsing errors.

For more details, see this [blog post on the Desmos engineering blog](https://engineering.desmos.com/articles/pratt-parser).

Hopefully this will serve as a nice starting point for anyone interested in building a web-based language. Enjoy!

# Setup

Clone the repo, then run

```
npm install
node fuse.js
```

Then open http://localhost:4444/

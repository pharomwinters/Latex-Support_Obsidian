import { LanguageSupport, StreamLanguage } from '@codemirror/language';

// Define LaTeX tokens with simpler highlighting to avoid extension conflicts
const latexLanguage = StreamLanguage.define({
    name: 'latex',
    startState() {
        return { 
            inMath: false, 
            inComment: false
        };
    },
    token(stream, state) {
        // Skip whitespace
        if (stream.eatSpace()) return null;
        
        // Handle comments
        if (stream.match('%')) {
            stream.skipToEnd();
            return 'comment';
        }
        
        // Handle math mode delimiters
        if (stream.match('$$')) {
            state.inMath = !state.inMath;
            return 'string-2';
        }
        if (stream.match('$')) {
            state.inMath = !state.inMath;
            return 'string-2';
        }
        
        // Handle math mode content
        if (state.inMath) {
            if (stream.match(/^\\[a-zA-Z]+/)) {
                return 'keyword';
            }
            if (stream.match(/^[{}]/)) {
                return 'bracket';
            }
            stream.next();
            return 'number';
        }
        
        // Handle LaTeX commands
        if (stream.match(/^\\[a-zA-Z*]+/)) {
            return 'keyword';
        }
        
        // Handle special commands like \begin and \end
        if (stream.match(/^\\(begin|end)\b/)) {
            return 'def';
        }
        
        // Handle braces
        if (stream.match(/^[{}]/)) {
            return 'bracket';
        }
        
        // Handle brackets
        if (stream.match(/^[\[\]]/)) {
            return 'bracket';
        }
        
        // Handle ampersand (table alignment)
        if (stream.match('&')) {
            return 'operator';
        }
        
        // Handle special characters
        if (stream.match(/^[~^_]/)) {
            return 'atom';
        }
        
        // Default: consume one character
        stream.next();
        return null;
    }
});

export function latex() {
    return new LanguageSupport(latexLanguage);
} 
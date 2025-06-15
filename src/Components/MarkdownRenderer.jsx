// Create src/components/MarkdownRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const MarkdownRenderer = ({ content, className = "" }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const markdownComponents = {
    // Headings
    h1: ({ children }) => (
      <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </h3>
    ),
    
    // Paragraphs
    p: ({ children }) => (
      <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </p>
    ),
    
    // Lists
    ul: ({ children }) => (
      <ul className={`mb-4 ml-6 space-y-2 list-disc ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={`mb-4 ml-6 space-y-2 list-decimal ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    
    // Links
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 underline transition-colors"
      >
        {children}
      </a>
    ),
    
    // Emphasis
    strong: ({ children }) => (
      <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className={`italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </em>
    ),
    
    // Code
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className={`px-2 py-1 rounded text-sm font-mono ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300 border border-gray-700' 
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            {children}
          </code>
        );
      }
      return (
        <pre className={`p-4 rounded-lg overflow-x-auto mb-4 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
        }`}>
          <code className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            {children}
          </code>
        </pre>
      );
    },
    
    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 border-blue-500 pl-4 py-2 mb-4 italic ${
        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
      }`}>
        {children}
      </blockquote>
    ),
    
    // Horizontal rule
    hr: () => (
      <hr className={`my-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
    )
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

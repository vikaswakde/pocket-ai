import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { CheckIcon, ClipboardIcon, CopyIcon } from "lucide-react";

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return match ? (
    <div className="bg-neutral-900/70 dark:bg-gray-700/20 rounded-md my-4">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-500/90 dark:border-gray-700/90">
        <span className="text-xs text-gray-300/90 dark:text-gray-400">
          {match[1]}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {isCopied ? (
            <CheckIcon className="text-green-600" size={16} />
          ) : (
            <CopyIcon className="text-gray-400" size={16} />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={dracula}
        language={match[1]}
        PreTag="div"
        wrapLongLines={true}
        wrapLines={true}
        customStyle={{
          fontSize: "12px",
          lineHeight: "1.8",
          fontFamily: "Monaco",
          fontWeight: "normal",
          fontStyle: "normal",
          background: "transparent",
          padding: "0.8rem",
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code
      className="bg-gray-500/10 dark:bg-white/10 rounded-md px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:text-gray-200"
      {...props}
    >
      {children}
    </code>
  );
};

export const MarkdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-2xl font-bold my-4" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl font-bold my-3" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg font-bold my-2" {...props} />
  ),
  p: ({ node, ...props }: any) => <p className="my-2" {...props} />,
  a: ({ node, href, children, ...props }: any) => {
    const isExternal =
      href && (href.startsWith("http") || href.startsWith("//"));
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-blue-500 hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-outside pl-5 my-4 space-y-2" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-outside pl-5 my-4 space-y-2" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="my-1" {...props} />,
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-blue-500 bg-blue-500/10 p-4 italic my-4"
      {...props}
    />
  ),
  code: CodeBlock,
  table: ({ node, ...props }: any) => (
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-hidden">
      <table className="w-full" {...props} />
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
  ),
  tbody: ({ node, ...props }: any) => (
    <tbody
      className="bg-white dark:bg-black/30 divide-y divide-gray-200 dark:divide-gray-700"
      {...props}
    />
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800/50" {...props} />
  ),
  th: ({ node, ...props }: any) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
      {...props}
    />
  ),
  td: ({ node, ...props }: any) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
};

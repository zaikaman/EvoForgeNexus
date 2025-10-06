'use client';

interface CodeEditorProps {
  agent: {
    id: string;
    name: string;
    code: string;
  };
}

const SAMPLE_CODE = `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`;

export default function CodeEditor({ agent }: CodeEditorProps) {
  const code = agent.code || SAMPLE_CODE;

  return (
    <div className="terminal-border rounded-lg bg-gray-950/80 overflow-hidden">
      {/* Editor Header */}
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{agent.name}</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-auto max-h-80">
        <pre className="code-editor text-gray-300">
          {code.split('\n').map((line, idx) => (
            <div key={idx} className="flex">
              <span className="text-gray-600 w-8 text-right pr-4 select-none">
                {idx + 1}
              </span>
              <code>{line}</code>
            </div>
          ))}
        </pre>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 px-4 py-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>JavaScript</span>
        <span>UTF-8</span>
        <span>Ln {code.split('\n').length}, Col 1</span>
      </div>
    </div>
  );
}

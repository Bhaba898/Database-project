const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds and Borders
  { regex: /bg-red-950/g, replace: 'bg-blue-950' },
  { regex: /border-red-900/g, replace: 'border-blue-900' },
  { regex: /border-red-800/g, replace: 'border-blue-800' },
  
  // Texts
  { regex: /text-red-800/g, replace: 'text-blue-800' },
  { regex: /text-red-700/g, replace: 'text-blue-700' },
  { regex: /text-red-600/g, replace: 'text-blue-600' },
  { regex: /text-red-500/g, replace: 'text-blue-500' },
  { regex: /text-red-400/g, replace: 'text-blue-400' },
  { regex: /text-red-300/g, replace: 'text-blue-300' },
  { regex: /text-red-200/g, replace: 'text-blue-200' },
  { regex: /text-rose-500/g, replace: 'text-blue-400' },
  { regex: /text-rose-400/g, replace: 'text-blue-300' },

  // Aurora Backgrounds
  { regex: /bg-red-900/g, replace: 'bg-blue-900' },
  { regex: /bg-red-800/g, replace: 'bg-blue-800' },
  { regex: /bg-red-600/g, replace: 'bg-blue-600' },
  { regex: /bg-red-500/g, replace: 'bg-blue-500' },
  { regex: /bg-red-400/g, replace: 'bg-blue-400' },
  { regex: /from-rose-500/g, replace: 'from-blue-500' },
  { regex: /to-rose-700/g, replace: 'to-blue-700' },

  // Chart hex colors
  { regex: /#ef4444/g, replace: '#3b82f6' }, // blue-500
  { regex: /rgba\(239, 68, 68,/g, replace: 'rgba(59, 130, 246,' },
  { regex: /#dc2626/g, replace: '#2563eb' }, // blue-600
  { regex: /#b91c1c/g, replace: '#1d4ed8' }, // blue-700
  { regex: /#991b1b/g, replace: '#1e40af' }, // blue-800
  { regex: /#7f1d1d/g, replace: '#1e3a8a' }, // blue-900
  { regex: /#ec4899/g, replace: '#0ea5e9' }, // sky-500 -> just in case it escaped previous regex
  { regex: /#64748b/g, replace: '#60a5fa' }, // slate-500 to blue-400

  // BorderGlow custom rgb (Red -> Blue)
  { regex: /rgba\(255, 30, 80, 1\)/g, replace: 'rgba(59, 130, 246, 1)' }, // Fallback from rose if I missed it
  { regex: /rgba\(255, 0, 0, 1\)/g, replace: 'rgba(59, 130, 246, 1)' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const { regex, replace } of replacements) {
        newContent = newContent.replace(regex, replace);
      }
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${path.basename(fullPath)}`);
      }
    }
  }
}

processDir(srcDir);

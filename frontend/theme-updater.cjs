const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Slate to Black / Neutral-dark
  { regex: /bg-slate-900(?:\/\d+)?/g, replace: 'bg-black' },
  { regex: /bg-slate-950(?:\/\d+)?/g, replace: 'bg-black' },
  { regex: /bg-slate-800(?:\/\d+)?/g, replace: 'bg-black' },
  { regex: /bg-neutral-900(?:\/\d+)?/g, replace: 'bg-black' },
  { regex: /bg-slate-700(?:\/\d+)?/g, replace: 'bg-red-950' },
  { regex: /border-slate-700/g, replace: 'border-red-900/50' },
  { regex: /border-slate-800/g, replace: 'border-red-900' },
  { regex: /border-neutral-800/g, replace: 'border-red-900' },
  
  // Texts
  { regex: /text-slate-300/g, replace: 'text-red-200' },
  { regex: /text-slate-400/g, replace: 'text-red-300' },
  { regex: /text-slate-500/g, replace: 'text-red-400' },
  
  // Colors (Teal, Cyan, Emerald, Rose) to Red
  { regex: /teal-400/g, replace: 'red-500' },
  { regex: /teal-300/g, replace: 'red-400' },
  { regex: /teal-500/g, replace: 'red-600' },
  { regex: /cyan-500/g, replace: 'red-600' },
  { regex: /cyan-400/g, replace: 'red-500' },
  { regex: /cyan-300/g, replace: 'red-400' },
  { regex: /rose-500/g, replace: 'red-600' },
  { regex: /rose-700/g, replace: 'red-800' },
  { regex: /rose-400/g, replace: 'red-500' },
  { regex: /emerald-500/g, replace: 'red-500' },
  { regex: /emerald-400/g, replace: 'red-400' },
  
  // Chart Colors in Dashboard.jsx
  { regex: /#2dd4bf/g, replace: '#ef4444' }, // teal-400 -> red-500
  { regex: /rgba\(45, 212, 191,/g, replace: 'rgba(239, 68, 68,' },
  { regex: /#f43f5e/g, replace: '#ef4444' },
  { regex: /#8b5cf6/g, replace: '#dc2626' }, // violet -> red-600
  { regex: /#0ea5e9/g, replace: '#b91c1c' }, // sky -> red-700
  { regex: /#10b981/g, replace: '#991b1b' }, // emerald -> red-800
  { regex: /#f59e0b/g, replace: '#7f1d1d' }, // amber -> red-900

  // BorderGlow custom rgb
  { regex: /rgba\(255, 30, 80, 1\)/g, replace: 'rgba(255, 0, 0, 1)' }
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

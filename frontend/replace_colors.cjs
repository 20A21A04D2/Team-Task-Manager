const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const frontendSrc = path.join(__dirname, 'src');
const files = walk(frontendSrc);

const excludedFiles = ['LandingPage.jsx', 'DashboardLayout.jsx'];

files.forEach(file => {
  const fileName = path.basename(file);
  if (excludedFiles.includes(fileName)) {
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // text colors
  content = content.replace(/text-slate-100/g, 'text-text-heading');
  content = content.replace(/text-slate-200/g, 'text-text-heading');
  content = content.replace(/text-slate-300/g, 'text-text-main');
  content = content.replace(/text-slate-400/g, 'text-text-muted');
  content = content.replace(/text-slate-500/g, 'text-text-muted');

  // border colors
  content = content.replace(/border-slate-850/g, 'border-border-color');
  content = content.replace(/border-slate-800\/[0-9]+/g, 'border-border-color');
  content = content.replace(/border-slate-800/g, 'border-border-color');
  content = content.replace(/border-slate-700\/[0-9]+/g, 'border-border-color');
  content = content.replace(/border-slate-700/g, 'border-border-color');
  content = content.replace(/divide-slate-800\/[0-9]+/g, 'divide-border-color');
  content = content.replace(/divide-slate-800/g, 'divide-border-color');

  // bg colors
  content = content.replace(/bg-slate-950\/[0-9]+/g, 'bg-bg-main/50');
  content = content.replace(/bg-slate-950/g, 'bg-bg-main');
  content = content.replace(/bg-slate-900\/60/g, 'bg-bg-surface');
  content = content.replace(/bg-slate-900\/50/g, 'bg-bg-main');
  content = content.replace(/bg-slate-900\/40/g, 'bg-bg-surface/40');
  content = content.replace(/bg-slate-900/g, 'bg-bg-surface');
  content = content.replace(/bg-slate-800\/[0-9]+/g, 'bg-bg-surface');
  content = content.replace(/bg-slate-800/g, 'bg-bg-surface');
  
  // place-holders
  content = content.replace(/placeholder-slate-500/g, 'placeholder-text-muted');
  content = content.replace(/placeholder-slate-400/g, 'placeholder-text-muted');
  
  // rings
  content = content.replace(/ring-slate-800/g, 'ring-border-color');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});

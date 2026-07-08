/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Monitor, Server, Award } from 'lucide-react';

export default function ElectronGuide() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const packageJsonCode = `{
  "name": "marshall-mix-design-jkr",
  "version": "1.0.0",
  "description": "Standalone Marshall Mix Design SPJ Section 4 Suite",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build-exe": "electron-builder --windows nsis:ia32 nsis:x64"
  },
  "dependencies": {},
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0"
  },
  "build": {
    "appId": "com.jkrmarshall.app",
    "win": {
      "target": "nsis"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    },
    "files": [
      "main.js",
      "dist/**/*"
    ]
  }
}`;

  const mainJsCode = `const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Marshall Mix Design JKR Suite",
    icon: path.join(__dirname, 'dist/favicon.ico'), // Fallback icon path
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Load the compiled React SPA static production file
  win.loadFile(path.join(__dirname, 'dist/index.html'));

  // Open dev tools in local environment if needed
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in" id="electron-guide-container">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between" id="electron-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Monitor className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-blue-400 tracking-widest font-semibold uppercase">Standalone Packaging</span>
            <h2 className="text-lg font-semibold text-white tracking-tight">Convert App to Windows Standalone .EXE</h2>
          </div>
        </div>
        <div className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-mono font-medium border border-slate-700">
          Electron Framework
        </div>
      </div>

      <div className="p-6 space-y-6" id="electron-body">
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-xs text-blue-900 leading-normal" id="electron-intro">
          <Award className="w-4 h-4 text-blue-600 inline mr-1" />
          <strong>Fully Offline Capability:</strong> Since this Marshall Mix Design suite is built entirely with client-side React and direct SVG mathematical rendering, it runs 100% offline. Wrapping it in **Electron** compiles everything into a single, high-performance local **Windows .EXE** with no cloud database or server dependencies.
        </div>

        {/* Packaging steps */}
        <div className="space-y-4" id="electron-steps">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            Step-by-Step Compilation Guide
          </h3>

          <ol className="text-xs text-slate-600 space-y-4 list-decimal list-inside" id="steps-list">
            <li>
              <strong className="text-slate-800">Generate local build files</strong>
              <p className="pl-4 mt-1 text-slate-500">
                In your project folder, run the build script to compile the React code into highly compressed static HTML, CSS, and JS:
              </p>
              <div className="pl-4 mt-2">
                <div className="bg-slate-950 text-slate-200 font-mono p-3 rounded-lg flex items-center justify-between border border-slate-800">
                  <span>npm run build</span>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'cmd-build')}
                    className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
                  >
                    {copiedSection === 'cmd-build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">This produces a compiled folder called <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">dist/</code> in your root directory.</p>
              </div>
            </li>

            <li>
              <strong className="text-slate-800">Establish the Electron workspace</strong>
              <p className="pl-4 mt-1 text-slate-500">
                Create a new empty directory (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">marshall-desktop/</code>) on your local machine. Copy the compiled <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">dist/</code> folder inside it.
              </p>
            </li>

            <li>
              <strong className="text-slate-800">Create the configuration and bootstrap files</strong>
              <p className="pl-4 mt-1 text-slate-500">
                Create two files in your new <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">marshall-desktop/</code> directory:
              </p>
              
              {/* File 1: main.js */}
              <div className="pl-4 mt-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold font-mono">
                  <FileCode className="w-3.5 h-3.5 text-blue-500" /> main.js (Electron Main Window Process)
                </div>
                <div className="bg-slate-950 text-slate-200 font-mono p-4 rounded-lg border border-slate-800 relative group text-[11px] overflow-x-auto max-h-56">
                  <pre>{mainJsCode}</pre>
                  <button
                    onClick={() => copyToClipboard(mainJsCode, 'file-mainjs')}
                    className="absolute top-3 right-3 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition shadow-sm"
                  >
                    {copiedSection === 'file-mainjs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* File 2: package.json */}
              <div className="pl-4 mt-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold font-mono">
                  <FileCode className="w-3.5 h-3.5 text-blue-500" /> package.json (Dependency &amp; Bundler Specs)
                </div>
                <div className="bg-slate-950 text-slate-200 font-mono p-4 rounded-lg border border-slate-800 relative group text-[11px] overflow-x-auto max-h-56">
                  <pre>{packageJsonCode}</pre>
                  <button
                    onClick={() => copyToClipboard(packageJsonCode, 'file-pkgjson')}
                    className="absolute top-3 right-3 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition shadow-sm"
                  >
                    {copiedSection === 'file-pkgjson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </li>

            <li>
              <strong className="text-slate-800">Assemble and compile to .EXE</strong>
              <p className="pl-4 mt-1 text-slate-500">
                In your terminal inside <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">marshall-desktop/</code>, install the packaging dependencies and compile the executable:
              </p>
              <div className="pl-4 mt-2 space-y-2">
                <div className="bg-slate-950 text-slate-200 font-mono p-3 rounded-lg flex items-center justify-between border border-slate-800 text-[11px]">
                  <span>npm install</span>
                  <button
                    onClick={() => copyToClipboard('npm install', 'cmd-install')}
                    className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
                  >
                    {copiedSection === 'cmd-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                
                <div className="bg-slate-950 text-slate-200 font-mono p-3 rounded-lg flex items-center justify-between border border-slate-800 text-[11px]">
                  <span>npm run build-exe</span>
                  <button
                    onClick={() => copyToClipboard('npm run build-exe', 'cmd-pack')}
                    className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
                  >
                    {copiedSection === 'cmd-pack' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">This produces a robust installer in the newly created <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">dist_electron/</code> directory ready for Windows!</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

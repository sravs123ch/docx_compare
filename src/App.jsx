import React, { useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import mammoth from "mammoth";
import { diffLines, diffWords } from "diff";
import "./docx-preview.css";
import "./App.css";

function App() {
  const containerLeft = useRef(null);
  const containerRight = useRef(null);

  const [texts, setTexts] = useState({ left: "", right: "" });
  const [fileNames, setFileNames] = useState({ left: "", right: "" });
  const [showDiff, setShowDiff] = useState(false);
  const [diffMode, setDiffMode] = useState("lines"); // "lines" or "words"
  const [renderedDiffHtml, setRenderedDiffHtml] = useState("");

  const handleFileUpload = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    setFileNames(prev => ({ ...prev, [side]: file.name }));

    // Render DOCX visually
    if (side === "left") {
      await renderAsync(arrayBuffer, containerLeft.current);
    } else {
      await renderAsync(arrayBuffer, containerRight.current);
    }

    // Extract plain text with Mammoth
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    setTexts((prev) => ({ ...prev, [side]: value }));
  };

  const generateGitStyleDiff = () => {
    if (!texts.left || !texts.right) return;

    const diffFunction = diffMode === "lines" ? diffLines : diffWords;
    const diff = diffFunction(texts.left, texts.right);

    let diffHtml = `
      <div class="diff-header">
        <div class="file-comparison">
          <span class="file-old">--- ${fileNames.left || 'File 1'}</span>
          <span class="file-new">+++ ${fileNames.right || 'File 2'}</span>
        </div>
      </div>
      <div class="diff-content">
    `;

    let lineNumber = 1;
    
    diff.forEach((part, index) => {
      const lines = part.value.split('\n');
      
      if (part.added) {
        lines.forEach((line, i) => {
          if (i === lines.length - 1 && line === '') return;
          diffHtml += `<div class="diff-line added">
            <span class="line-number">+</span>
            <span class="line-content">+${line}</span>
          </div>`;
        });
      } else if (part.removed) {
        lines.forEach((line, i) => {
          if (i === lines.length - 1 && line === '') return;
          diffHtml += `<div class="diff-line removed">
            <span class="line-number">-</span>
            <span class="line-content">-${line}</span>
          </div>`;
        });
      } else {
        lines.forEach((line, i) => {
          if (i === lines.length - 1 && line === '') return;
          diffHtml += `<div class="diff-line unchanged">
            <span class="line-number">${lineNumber}</span>
            <span class="line-content"> ${line}</span>
          </div>`;
          lineNumber++;
        });
      }
    });

    diffHtml += '</div>';
    
    setRenderedDiffHtml(diffHtml);
    setShowDiff(true);
  };

  const resetComparison = () => {
    setShowDiff(false);
    setTexts({ left: "", right: "" });
    setFileNames({ left: "", right: "" });
    setRenderedDiffHtml("");
    if (containerLeft.current) containerLeft.current.innerHTML = "";
    if (containerRight.current) containerRight.current.innerHTML = "";
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>📄 Git-Style DOCX Comparison</h1>
        <p className="subtitle">Compare DOCX files with Git-like diff visualization</p>
      </div>

      <div className="controls">
        <div className="diff-mode-selector">
          <label>
            <input
              type="radio"
              name="diffMode"
              value="lines"
              checked={diffMode === "lines"}
              onChange={(e) => setDiffMode(e.target.value)}
            />
            Line-by-line
          </label>
          <label>
            <input
              type="radio"
              name="diffMode"
              value="words"
              checked={diffMode === "words"}
              onChange={(e) => setDiffMode(e.target.value)}
            />
            Word-by-word
          </label>
        </div>

        <div className="action-buttons">
          <button 
            className="compare-btn" 
            onClick={generateGitStyleDiff}
            disabled={!texts.left || !texts.right}
          >
            🔍 Compare Files
          </button>
          <button className="reset-btn" onClick={resetComparison}>
            🔄 Reset
          </button>
        </div>
      </div>

      {!showDiff ? (
        <div className="upload-section">
          <div className="file-upload-grid">
            <div className="upload-card">
              <h3>📁 Original File</h3>
              <input
                type="file"
                accept=".docx"
                onChange={(e) => handleFileUpload(e, "left")}
                className="file-input"
              />
              {fileNames.left && (
                <div className="file-info">
                  <span className="file-name">{fileNames.left}</span>
                </div>
              )}
              <div ref={containerLeft} className="docx-preview"></div>
            </div>

            <div className="upload-card">
              <h3>📁 Modified File</h3>
              <input
                type="file"
                accept=".docx"
                onChange={(e) => handleFileUpload(e, "right")}
                className="file-input"
              />
              {fileNames.right && (
                <div className="file-info">
                  <span className="file-name">{fileNames.right}</span>
                </div>
              )}
              <div ref={containerRight} className="docx-preview"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="diff-section">
          <div className="diff-stats">
            <span className="stats-info">
              Comparing: <strong>{fileNames.left}</strong> vs <strong>{fileNames.right}</strong>
            </span>
          </div>
          <div 
            className="git-diff-container"
            dangerouslySetInnerHTML={{ __html: renderedDiffHtml }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default App;
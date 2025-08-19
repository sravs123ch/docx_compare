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
  const [showComparison, setShowComparison] = useState(false);
  const [diffMode, setDiffMode] = useState("lines");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const arrayBuffer = await file.arrayBuffer();
    setFileNames(prev => ({ ...prev, [side]: file.name }));

    try {
      // Render DOCX visually
      const container = side === "left" ? containerLeft.current : containerRight.current;
      if (container) {
        container.innerHTML = ""; // Clear previous content
        await renderAsync(arrayBuffer, container);
      }

      // Extract plain text with Mammoth for comparison
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      setTexts((prev) => ({ ...prev, [side]: value }));
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const highlightDifferencesInDocx = () => {
    if (!texts.left || !texts.right || !containerLeft.current || !containerRight.current) return;

    const diffFunction = diffMode === "lines" ? diffLines : diffWords;
    const diff = diffFunction(texts.left, texts.right);

    // Create maps to track which text should be highlighted
    const leftHighlights = new Map();
    const rightHighlights = new Map();

    let leftIndex = 0;
    let rightIndex = 0;

    diff.forEach((part) => {
      if (part.removed) {
        // Mark removed text in left document
        const endIndex = leftIndex + part.value.length;
        leftHighlights.set(leftIndex, { end: endIndex, type: 'removed' });
        leftIndex = endIndex;
      } else if (part.added) {
        // Mark added text in right document
        const endIndex = rightIndex + part.value.length;
        rightHighlights.set(rightIndex, { end: endIndex, type: 'added' });
        rightIndex = endIndex;
      } else {
        // Common text - advance both indices
        leftIndex += part.value.length;
        rightIndex += part.value.length;
      }
    });

    // Apply highlights to both containers
    applyHighlightsToContainer(containerLeft.current, leftHighlights, texts.left);
    applyHighlightsToContainer(containerRight.current, rightHighlights, texts.right);
  };

  const applyHighlightsToContainer = (container, highlights, originalText) => {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    let currentIndex = 0;
    textNodes.forEach(textNode => {
      const nodeText = textNode.textContent;
      const nodeStart = currentIndex;
      const nodeEnd = currentIndex + nodeText.length;

      // Check if this text node contains highlighted text
      for (let [startIndex, { end: endIndex, type }] of highlights) {
        if (startIndex < nodeEnd && endIndex > nodeStart) {
          // Calculate relative positions within this text node
          const relativeStart = Math.max(0, startIndex - nodeStart);
          const relativeEnd = Math.min(nodeText.length, endIndex - nodeStart);

          if (relativeStart < relativeEnd) {
            // Split the text node and wrap the highlighted portion
            const parent = textNode.parentNode;
            const beforeText = nodeText.substring(0, relativeStart);
            const highlightText = nodeText.substring(relativeStart, relativeEnd);
            const afterText = nodeText.substring(relativeEnd);

            // Create new elements
            const fragment = document.createDocumentFragment();
            
            if (beforeText) {
              fragment.appendChild(document.createTextNode(beforeText));
            }

            const highlightSpan = document.createElement('span');
            highlightSpan.className = type === 'removed' ? 'diff-removed' : 'diff-added';
            highlightSpan.textContent = highlightText;
            fragment.appendChild(highlightSpan);

            if (afterText) {
              fragment.appendChild(document.createTextNode(afterText));
            }

            parent.replaceChild(fragment, textNode);
            break; // Only handle one highlight per text node for simplicity
          }
        }
      }

      currentIndex = nodeEnd;
    });
  };

  const compareFiles = () => {
    if (!texts.left || !texts.right) return;
    
    setIsLoading(true);
    setTimeout(() => {
      highlightDifferencesInDocx();
      setShowComparison(true);
      setIsLoading(false);
    }, 100);
  };

  const resetComparison = () => {
    setShowComparison(false);
    setTexts({ left: "", right: "" });
    setFileNames({ left: "", right: "" });
    if (containerLeft.current) containerLeft.current.innerHTML = "";
    if (containerRight.current) containerRight.current.innerHTML = "";
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>📄 DOCX Side-by-Side Comparison</h1>
        <p className="subtitle">Compare DOCX files with highlighted differences in original format</p>
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
            onClick={compareFiles}
            disabled={!texts.left || !texts.right || isLoading}
          >
            {isLoading ? "⏳ Processing..." : "🔍 Compare Files"}
          </button>
          <button className="reset-btn" onClick={resetComparison}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="comparison-layout">
        {/* File Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <h3>📁 Original Document</h3>
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
          </div>

          <div className="upload-card">
            <h3>📁 Modified Document</h3>
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
          </div>
        </div>

        {/* Document Preview Section */}
        {(texts.left || texts.right) && (
          <div className="preview-section">
            <div className="document-container">
              <div className="document-panel">
                <div className="document-header">
                  <h4>📄 {fileNames.left || "Document 1"}</h4>
                  {showComparison && <span className="legend removed">🔴 Removed content</span>}
                </div>
                <div 
                  ref={containerLeft} 
                  className="docx-preview-container"
                ></div>
              </div>

              <div className="document-panel">
                <div className="document-header">
                  <h4>📄 {fileNames.right || "Document 2"}</h4>
                  {showComparison && <span className="legend added">🟢 Added content</span>}
                </div>
                <div 
                  ref={containerRight} 
                  className="docx-preview-container"
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showComparison && (
        <div className="comparison-stats">
          <div className="stats-card">
            <h4>📊 Comparison Results</h4>
            <p>Differences highlighted in both documents using {diffMode} comparison mode.</p>
            <div className="legend-container">
              <span className="legend-item removed">🔴 Content removed from original</span>
              <span className="legend-item added">🟢 Content added in modified version</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
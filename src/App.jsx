// import React, { useRef, useState } from "react";
// import { renderAsync } from "docx-preview";
// import mammoth from "mammoth";
// import { diffWords } from "diff";
// import "./docx-preview.css";
// import "./highlight.css";
// import "./App.css"; 

// function App() {
//   const containerLeft = useRef(null);
//   const containerRight = useRef(null);
//   const highlightLeft = useRef(null);
//   const highlightRight = useRef(null);

//   const [texts, setTexts] = useState({ left: "", right: "" });

//   const handleFileUpload = async (e, side) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const arrayBuffer = await file.arrayBuffer();

//     // Render DOCX visually (keep formatting)
//     if (side === "left") {
//       await renderAsync(arrayBuffer, containerLeft.current);
//     } else {
//       await renderAsync(arrayBuffer, containerRight.current);
//     }

//     // Extract plain text with Mammoth (used only for comparison)
//     const { value } = await mammoth.extractRawText({ arrayBuffer });
//     setTexts((prev) => ({ ...prev, [side]: value }));
//   };

//   const highlightSimilarities = () => {
//     const diff = diffWords(texts.left, texts.right);

//     const leftHighlighted = diff
//       .map((part) =>
//         part.added
//           ? ""
//           : part.removed
//           ? `<span>${part.value}</span>`
//           : `<span class="highlight">${part.value}</span>`
//       )
//       .join("");

//     const rightHighlighted = diff
//       .map((part) =>
//         part.removed
//           ? ""
//           : part.added
//           ? `<span>${part.value}</span>`
//           : `<span class="highlight">${part.value}</span>`
//       )
//       .join("");

//     // Show highlights in separate areas (don't overwrite docx preview)
//     highlightLeft.current.innerHTML = leftHighlighted;
//     highlightRight.current.innerHTML = rightHighlighted;
//   };

//   return (
//     <div className="app-container">
//       <h1>DOCX Comparison</h1>
//       <button className="compare-btn" onClick={highlightSimilarities}>
//         Highlight Similar Text
//       </button>

//       <div className="comparison-wrapper">
//         {/* Left File */}
//         <div className="docx-section">
//           <input
//             type="file"
//             accept=".docx"
//             onChange={(e) => handleFileUpload(e, "left")}
//           />
//           <h3>Original</h3>
//           <div ref={containerLeft} className="docx-wrapper"></div>
//           <h3>Highlighted Similarities</h3>
//           <div ref={highlightLeft} className="highlight-box"></div>
//         </div>

//         {/* Right File */}
//         <div className="docx-section">
//           <input
//             type="file"
//             accept=".docx"
//             onChange={(e) => handleFileUpload(e, "right")}
//           />
//           <h3>Original</h3>
//           <div ref={containerRight} className="docx-wrapper"></div>
//           <h3>Highlighted Similarities</h3>
//           <div ref={highlightRight} className="highlight-box"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import mammoth from "mammoth";
import { diffWords } from "diff";
import "./docx-preview.css";
import "./highlight.css";
import "./App.css";

function App() {
  const containerLeft = useRef(null);
  const containerRight = useRef(null);
  const highlightLeft = useRef(null);
  const highlightRight = useRef(null);

  const [texts, setTexts] = useState({ left: "", right: "" });

  const handleFileUpload = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    // Render DOCX visually (keep formatting)
    if (side === "left") {
      await renderAsync(arrayBuffer, containerLeft.current);
    } else {
      await renderAsync(arrayBuffer, containerRight.current);
    }

    // Extract plain text with Mammoth (used only for comparison)
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    setTexts((prev) => ({ ...prev, [side]: value }));
  };

  const highlightSimilarities = () => {
    const diff = diffWords(texts.left, texts.right);

    const leftHighlighted = diff
      .map((part) =>
        part.added
          ? ""
          : part.removed
          ? `<span>${part.value}</span>`
          : `<span class="highlight">${part.value}</span>`
      )
      .join("");

    const rightHighlighted = diff
      .map((part) =>
        part.removed
          ? ""
          : part.added
          ? `<span>${part.value}</span>`
          : `<span class="highlight">${part.value}</span>`
      )
      .join("");

    // Show highlights in separate areas
    highlightLeft.current.innerHTML = leftHighlighted;
    highlightRight.current.innerHTML = rightHighlighted;

    // 🔥 Auto-scroll to highlights
    if (highlightLeft.current) {
      highlightLeft.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="app-container">
      <h1>DOCX Comparison</h1>
      <button className="compare-btn" onClick={highlightSimilarities}>
        Highlight Similar Text
      </button>

      <div className="comparison-wrapper">
        {/* Left File */}
        <div className="docx-section">
          <input
            type="file"
            accept=".docx"
            onChange={(e) => handleFileUpload(e, "left")}
          />
          <h3>Original</h3>
          <div ref={containerLeft} className="docx-wrapper"></div>
          <h3>Highlighted Similarities</h3>
          <div ref={highlightLeft} className="highlight-box"></div>
        </div>

        {/* Right File */}
        <div className="docx-section">
          <input
            type="file"
            accept=".docx"
            onChange={(e) => handleFileUpload(e, "right")}
          />
          <h3>Original</h3>
          <div ref={containerRight} className="docx-wrapper"></div>
          <h3>Highlighted Similarities</h3>
          <div ref={highlightRight} className="highlight-box"></div>
        </div>
      </div>
    </div>
  );
}

export default App;


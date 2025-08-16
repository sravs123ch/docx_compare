// // import React, { useRef, useState } from "react";
// // import { renderAsync } from "docx-preview";

// // // helper to collect plain text from preview
// // const getTextNodes = (root) => {
// //   const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
// //   let textNodes = [];
// //   while (walker.nextNode()) {
// //     textNodes.push(walker.currentNode);
// //   }
// //   return textNodes;
// // };

// // function App() {
// //   const leftRef = useRef(null);
// //   const rightRef = useRef(null);
// //   const [files, setFiles] = useState({ left: null, right: null });

// //   // render DOCX in a given container
// //   const renderDocx = async (file, container) => {
// //     container.innerHTML = ""; // clear old
// //     const buffer = await file.arrayBuffer();
// //     await renderAsync(buffer, container);
// //   };

// //   // highlight similar words in both previews
// //   const highlightSimilar = () => {
// //     if (!leftRef.current || !rightRef.current) return;

// //     const leftNodes = getTextNodes(leftRef.current);
// //     const rightNodes = getTextNodes(rightRef.current);

// //     const leftText = leftNodes.map((n) => n.nodeValue);
// //     const rightText = rightNodes.map((n) => n.nodeValue);

// //     // find intersection words
// //     const leftWords = leftText.join(" ").split(/\s+/);
// //     const rightWords = rightText.join(" ").split(/\s+/);

// //     const common = new Set(leftWords.filter((w) => rightWords.includes(w)));

// //     // highlight in left
// //     leftNodes.forEach((node) => {
// //       const parent = node.parentNode;
// //       const words = node.nodeValue.split(/\s+/).map((word) => {
// //         if (common.has(word)) {
// //           return `<span class="similar-text">${word}</span>`;
// //         }
// //         return word;
// //       });
// //       const span = document.createElement("span");
// //       span.innerHTML = words.join(" ");
// //       parent.replaceChild(span, node);
// //     });

// //     // highlight in right
// //     rightNodes.forEach((node) => {
// //       const parent = node.parentNode;
// //       const words = node.nodeValue.split(/\s+/).map((word) => {
// //         if (common.has(word)) {
// //           return `<span class="similar-text">${word}</span>`;
// //         }
// //         return word;
// //       });
// //       const span = document.createElement("span");
// //       span.innerHTML = words.join(" ");
// //       parent.replaceChild(span, node);
// //     });
// //   };

// //   const handleUpload = async (e, side) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setFiles((prev) => ({ ...prev, [side]: file }));

// //     if (side === "left") await renderDocx(file, leftRef.current);
// //     else await renderDocx(file, rightRef.current);

// //     if (files.left && files.right) {
// //       highlightSimilar();
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>DOCX Side-by-Side Comparison</h1>

// //       <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
// //         <div>
// //           <h3>Upload File 1</h3>
// //           <input type="file" accept=".docx" onChange={(e) => handleUpload(e, "left")} />
// //         </div>
// //         <div>
// //           <h3>Upload File 2</h3>
// //           <input type="file" accept=".docx" onChange={(e) => handleUpload(e, "right")} />
// //         </div>
// //       </div>

// //       <div
// //         style={{
// //           display: "flex",
// //           gap: "20px",
// //           overflowX: "auto",
// //           border: "1px solid #ccc",
// //           padding: "10px",
// //         }}
// //       >
// //         <div
// //           ref={leftRef}
// //           className="docx-wrapper"
// //           style={{ minWidth: "400px", maxWidth: "50%" }}
// //         ></div>
// //         <div
// //           ref={rightRef}
// //           className="docx-wrapper"
// //           style={{ minWidth: "400px", maxWidth: "50%" }}
// //         ></div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;


// import React, { useRef, useState } from "react";
// import { renderAsync } from "docx-preview";
// import mammoth from "mammoth";
// import { diffWords } from "diff";
// import "./docx-preview.css";
// import "./highlight.css"; 

// function App() {
//   const containerLeft = useRef(null);
//   const containerRight = useRef(null);
//   const [texts, setTexts] = useState({ left: "", right: "" });

//   const handleFileUpload = async (e, side) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const arrayBuffer = await file.arrayBuffer();

//     // Render DOCX visually
//     if (side === "left") {
//       await renderAsync(arrayBuffer, containerLeft.current);
//     } else {
//       await renderAsync(arrayBuffer, containerRight.current);
//     }

//     // Extract plain text with Mammoth
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

//     containerLeft.current.innerHTML = leftHighlighted;
//     containerRight.current.innerHTML = rightHighlighted;
//   };

//   return (
//     <div>
//       <h1>DOCX Side-by-Side Comparison</h1>
//       <button onClick={highlightSimilarities}>Highlight Similar Text</button>
//       <div style={{ display: "flex", gap: "10px" }}>
//         <div style={{ flex: 1 }}>
//           <input type="file" accept=".docx" onChange={(e) => handleFileUpload(e, "left")} />
//           <div ref={containerLeft} className="docx-wrapper"></div>
//         </div>
//         <div style={{ flex: 1 }}>
//           <input type="file" accept=".docx" onChange={(e) => handleFileUpload(e, "right")} />
//           <div ref={containerRight} className="docx-wrapper"></div>
//         </div>
//       </div>
//       {/* <button onClick={highlightSimilarities}>Highlight Similar Text</button> */}
//     </div>
//   );
// }

// export default App;

// import React, { useRef, useState } from "react";
// import { renderAsync } from "docx-preview";
// import mammoth from "mammoth";
// import { diffWords } from "diff";
// import "./docx-preview.css";
// import "./highlight.css"; 

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
//     <div>
//       <h1>DOCX Comparison</h1>
//       <button onClick={highlightSimilarities}>Highlight Similar Text</button>
      
//       <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//         {/* Left File */}
//         <div style={{ flex: 1 }}>
//           <input type="file" accept=".docx" onChange={(e) => handleFileUpload(e, "left")} />
//           <h3>Original</h3>
//           <div ref={containerLeft} className="docx-wrapper"></div>
//           <h3>Highlighted Similarities</h3>
//           <div ref={highlightLeft} className="highlight-box"></div>
//         </div>

//         {/* Right File */}
//         <div style={{ flex: 1 }}>
//           <input type="file" accept=".docx" onChange={(e) => handleFileUpload(e, "right")} />
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

    // Show highlights in separate areas (don't overwrite docx preview)
    highlightLeft.current.innerHTML = leftHighlighted;
    highlightRight.current.innerHTML = rightHighlighted;
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


// import React, { useRef, useState } from "react";
// import { renderAsync } from "docx-preview";
// import mammoth from "mammoth";
// import { diffWords } from "diff";
// import "./docx-preview.css";
// import "./highlight.css";

// function App() {
//   const containerLeft = useRef(null);
//   const containerRight = useRef(null);
//   const highlightLeft = useRef(null);
//   const highlightRight = useRef(null);

//   const [texts, setTexts] = useState({ left: "", right: "" });
//   const [showOriginal, setShowOriginal] = useState(true); // ✅ toggle flag

//   const handleFileUpload = async (e, side) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const arrayBuffer = await file.arrayBuffer();

//     // Render DOCX visually (only if originals should be shown)
//     if (side === "left" && containerLeft.current) {
//       await renderAsync(arrayBuffer, containerLeft.current);
//     } else if (side === "right" && containerRight.current) {
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

//     // ✅ Generate highlights immediately
//     if (highlightLeft.current) highlightLeft.current.innerHTML = leftHighlighted;
//     if (highlightRight.current) highlightRight.current.innerHTML = rightHighlighted;

//     // ✅ Hide originals right away
//     setShowOriginal(false);
//   };

//   return (
//     <div>
//       <h1>DOCX Side-by-Side Comparison</h1>
//       <button onClick={highlightSimilarities}>Highlight Similar Text</button>

//       <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//         {/* Left File */}
//         <div style={{ flex: 1 }}>
//           <input
//             type="file"
//             accept=".docx"
//             onChange={(e) => handleFileUpload(e, "left")}
//           />
//           {showOriginal ? (
//             <>
//               <h3>Original</h3>
//               <div ref={containerLeft} className="docx-wrapper"></div>
//             </>
//           ) : (
//             <>
//               <h3>Highlighted Similarities</h3>
//               <div ref={highlightLeft} className="highlight-box"></div>
//             </>
//           )}
//         </div>

//         {/* Right File */}
//         <div style={{ flex: 1 }}>
//           <input
//             type="file"
//             accept=".docx"
//             onChange={(e) => handleFileUpload(e, "right")}
//           />
//           {showOriginal ? (
//             <>
//               <h3>Original</h3>
//               <div ref={containerRight} className="docx-wrapper"></div>
//             </>
//           ) : (
//             <>
//               <h3>Highlighted Similarities</h3>
//               <div ref={highlightRight} className="highlight-box"></div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

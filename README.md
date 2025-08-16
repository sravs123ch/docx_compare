# DOCX Files Comparator

A modern React application for comparing DOCX files with side-by-side preview and difference highlighting.

## Features

- 📄 **DOCX File Upload**: Upload two DOCX files for comparison
- 👀 **Live Preview**: View DOCX files rendered in the browser using docx-preview
- 🔍 **Text Comparison**: Compare text content with highlighted differences
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Efficient file processing and rendering

## Technologies Used

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **docx-preview** - DOCX file rendering in the browser
- **diff** - Text difference comparison library
- **docx-preview** - DOCX file rendering and text extraction

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Upload two DOCX files using the file input fields

4. Click "Compare Files" to see the differences

5. Use "Reset" to clear the comparison and start over

## How It Works

### File Processing
- Files are read using FileReader API
- DOCX content is rendered using `docx-preview`
- Text is extracted from the rendered content for comparison

### Preview Rendering
- DOCX files are rendered using `docx-preview`
- Provides a WYSIWYG view of the document content
- Maintains original formatting, images, and layout

### Difference Detection
- Text content is compared using the `diff` library
- Differences are highlighted with color coding:
  - 🟢 **Green**: Added content
  - 🔴 **Red**: Removed content
  - ⚫ **Black**: Unchanged content

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── index.css        # Global styles
└── main.jsx         # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

This application works in all modern browsers that support:
- ES6+ JavaScript features
- FileReader API
- ArrayBuffer
- CSS Grid and Flexbox

## Limitations

- Only supports .docx files (not .doc)
- Text comparison is based on extracted text content
- Complex formatting differences may not be fully captured
- Large files may take longer to process

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [docx-preview](https://github.com/VolodymyrBaydalka/docx-preview) for DOCX rendering
- [diff](https://github.com/kpdecker/jsdiff) for text comparison
- [docx-preview](https://github.com/VolodymyrBaydalka/docx-preview) for DOCX rendering and text extraction

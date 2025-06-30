import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Share,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
  onAnnotationAdd?: (annotation: any) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, onAnnotationAdd }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(numPages, page + 1));
  };

  const zoomIn = () => {
    setScale(scale => Math.min(3.0, scale + 0.2));
  };

  const zoomOut = () => {
    setScale(scale => Math.max(0.5, scale - 0.2));
  };

  const rotateDocument = () => {
    setRotation(rotation => (rotation + 90) % 360);
  };

  const handlePageClick = (event: React.MouseEvent) => {
    if (onAnnotationAdd) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      // Create annotation at click position
      onAnnotationAdd({
        page: pageNumber,
        position: { x, y },
        content: 'New annotation',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <button
            onClick={rotateDocument}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors ml-2"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Download className="h-4 w-4" />
          </button>
          
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Share className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading=""
          className="shadow-lg"
        >
          <div onClick={handlePageClick} className="cursor-crosshair">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              className="border border-gray-300"
            />
          </div>
        </Document>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-center px-4 py-3 bg-white border-t border-gray-200">
        <input
          type="range"
          min={1}
          max={numPages}
          value={pageNumber}
          onChange={(e) => setPageNumber(parseInt(e.target.value))}
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};
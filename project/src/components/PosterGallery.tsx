import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Image, FileText, Download, ZoomIn } from 'lucide-react';

interface PosterGalleryProps {
  posterUrls: string[];
  eventTitle: string;
}

export const PosterGallery: React.FC<PosterGalleryProps> = ({
  posterUrls,
  eventTitle
}) => {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'markdown'>('grid');

  const isMarkdownFile = (url: string) => {
    return url.endsWith('.md') || url.includes('markdown');
  };

  const downloadPoster = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle}-poster-${index + 1}`;
    link.click();
  };

  if (posterUrls.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No posters available for this event</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Event Posters ({posterUrls.length})
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Image className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'markdown'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posterUrls.map((url, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {isMarkdownFile(url) ? (
                <div className="h-48 bg-blue-50 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-blue-500" />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={url}
                    alt={`Poster ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedPoster(url)}
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Poster {index + 1}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPoster(url)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="View full size"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => downloadPoster(url, index)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Markdown View */}
      {viewMode === 'markdown' && (
        <div className="space-y-8">
          {posterUrls.filter(isMarkdownFile).map((url, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="prose max-w-none">
                <ReactMarkdown>
                  {`# Poster ${index + 1}\n\nMarkdown content would be loaded from: ${url}`}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {posterUrls.filter(isMarkdownFile).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No markdown posters available</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for full-size view */}
      {selectedPoster && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
            >
              ×
            </button>
            
            {isMarkdownFile(selectedPoster) ? (
              <div className="bg-white rounded-lg p-8 max-h-full overflow-y-auto">
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {`# Poster\n\nMarkdown content would be loaded from: ${selectedPoster}`}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <img
                src={selectedPoster}
                alt="Full size poster"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
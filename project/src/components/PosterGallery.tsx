import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Image, FileText, Download, ZoomIn, Grid, List } from 'lucide-react';

interface PosterGalleryProps {
  posterUrls: string[];
  eventTitle: string;
}

export const PosterGallery: React.FC<PosterGalleryProps> = ({
  posterUrls,
  eventTitle
}) => {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'grid'>('gallery');

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
          Online Poster Gallery ({posterUrls.length} posters)
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'gallery'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Gallery View - Museum-like Exhibition */}
      {viewMode === 'gallery' && (
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-8">
          <div className="space-y-12">
            {posterUrls.map((url, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Poster Frame */}
                <div className="relative bg-gray-100 p-8">
                  <div className="bg-white p-4 shadow-xl rounded-lg">
                    {isMarkdownFile(url) ? (
                      <div className="h-96 bg-blue-50 flex items-center justify-center rounded">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900">Research Poster {index + 1}</h4>
                          <p className="text-gray-600">Interactive Markdown Presentation</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Poster ${index + 1}`}
                        className="w-full h-96 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedPoster(url)}
                      />
                    )}
                  </div>
                  
                  {/* Poster Info Plaque */}
                  <div className="absolute bottom-4 left-8 right-8">
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Research Poster {index + 1}</h4>
                          <p className="text-sm text-gray-600">Presented at {eventTitle}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedPoster(url)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            title="View full size"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadPoster(url, index)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Modal for full-size view */}
      {selectedPoster && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            
            {isMarkdownFile(selectedPoster) ? (
              <div className="bg-white rounded-lg p-8 max-h-full overflow-y-auto max-w-4xl">
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {`# Research Poster\n\nInteractive markdown content would be loaded from: ${selectedPoster}`}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <img
                src={selectedPoster}
                alt="Full size poster"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Image, 
  StickyNote, 
  Eraser,
  Download,
  Share2,
  Palette,
  Undo,
  Redo
} from 'lucide-react';
import { Whiteboard, WhiteboardElement } from '../types/projects';
import { useProjectStore } from '../store/projectStore';
import { useUserStore } from '../store/userStore';
import { nanoid } from 'nanoid';

interface WhiteboardCanvasProps {
  whiteboard: Whiteboard;
}

type Tool = 'pen' | 'eraser' | 'text' | 'rectangle' | 'circle' | 'sticky-note' | 'image';

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ whiteboard }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useUserStore();
  const { 
    getWhiteboardElements, 
    addWhiteboardElement, 
    updateWhiteboardElement,
    saveToStorage 
  } = useProjectStore();

  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);

  const whiteboardElements = getWhiteboardElements(whiteboard.id);

  useEffect(() => {
    setElements(whiteboardElements);
    redrawCanvas();
  }, [whiteboardElements]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = whiteboard.background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  }, [elements, whiteboard.background_color]);

  const drawElement = (ctx: CanvasRenderingContext2D, element: WhiteboardElement) => {
    ctx.save();
    
    switch (element.type) {
      case 'drawing':
        ctx.strokeStyle = element.style.strokeColor || '#000000';
        ctx.lineWidth = element.style.strokeWidth || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const path = JSON.parse(element.content);
        if (path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.stroke();
        }
        break;

      case 'rectangle':
        ctx.strokeStyle = element.style.strokeColor || '#000000';
        ctx.lineWidth = element.style.strokeWidth || 2;
        if (element.style.backgroundColor) {
          ctx.fillStyle = element.style.backgroundColor;
          ctx.fillRect(element.x, element.y, element.width, element.height);
        }
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        break;

      case 'circle':
        ctx.strokeStyle = element.style.strokeColor || '#000000';
        ctx.lineWidth = element.style.strokeWidth || 2;
        ctx.beginPath();
        const radius = Math.min(element.width, element.height) / 2;
        ctx.arc(element.x + element.width/2, element.y + element.height/2, radius, 0, 2 * Math.PI);
        if (element.style.backgroundColor) {
          ctx.fillStyle = element.style.backgroundColor;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'text':
        ctx.fillStyle = element.style.color || '#000000';
        ctx.font = `${element.style.fontSize || 16}px Arial`;
        ctx.fillText(element.content, element.x, element.y + (element.style.fontSize || 16));
        break;

      case 'sticky-note':
        // Draw sticky note background
        ctx.fillStyle = element.style.backgroundColor || '#fef08a';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Draw text
        ctx.fillStyle = '#374151';
        ctx.font = '14px Arial';
        const lines = element.content.split('\n');
        lines.forEach((line, index) => {
          ctx.fillText(line, element.x + 8, element.y + 20 + (index * 18));
        });
        break;
    }
    
    ctx.restore();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!user) return;

    const pos = getMousePos(e);
    setIsDrawing(true);

    if (selectedTool === 'pen') {
      setCurrentPath([pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !user) return;

    const pos = getMousePos(e);

    if (selectedTool === 'pen') {
      setCurrentPath(prev => [...prev, pos]);
      
      // Draw current stroke
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && currentPath.length > 1) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const lastPoint = currentPath[currentPath.length - 2];
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !user) return;

    setIsDrawing(false);

    if (selectedTool === 'pen' && currentPath.length > 1) {
      const element: WhiteboardElement = {
        id: nanoid(),
        whiteboard_id: whiteboard.id,
        type: 'drawing',
        x: Math.min(...currentPath.map(p => p.x)),
        y: Math.min(...currentPath.map(p => p.y)),
        width: Math.max(...currentPath.map(p => p.x)) - Math.min(...currentPath.map(p => p.x)),
        height: Math.max(...currentPath.map(p => p.y)) - Math.min(...currentPath.map(p => p.y)),
        content: JSON.stringify(currentPath),
        style: {
          strokeColor,
          strokeWidth
        },
        created_by: user.id,
        created_at: new Date().toISOString()
      };

      addWhiteboardElement(element);
      saveToStorage();
    }

    setCurrentPath([]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!user || selectedTool === 'pen') return;

    const pos = getMousePos(e);

    if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const element: WhiteboardElement = {
          id: nanoid(),
          whiteboard_id: whiteboard.id,
          type: 'text',
          x: pos.x,
          y: pos.y,
          width: text.length * 10,
          height: 20,
          content: text,
          style: {
            color: strokeColor,
            fontSize: 16
          },
          created_by: user.id,
          created_at: new Date().toISOString()
        };

        addWhiteboardElement(element);
        saveToStorage();
      }
    } else if (selectedTool === 'sticky-note') {
      const text = prompt('Enter note text:');
      if (text) {
        const element: WhiteboardElement = {
          id: nanoid(),
          whiteboard_id: whiteboard.id,
          type: 'sticky-note',
          x: pos.x,
          y: pos.y,
          width: 150,
          height: 100,
          content: text,
          style: {
            backgroundColor: '#fef08a'
          },
          created_by: user.id,
          created_at: new Date().toISOString()
        };

        addWhiteboardElement(element);
        saveToStorage();
      }
    }
  };

  const clearCanvas = () => {
    if (confirm('Clear the entire whiteboard? This action cannot be undone.')) {
      // In a real app, you'd remove all elements
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = whiteboard.background_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${whiteboard.title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'sticky-note', icon: StickyNote, label: 'Sticky Note' },
    { id: 'image', icon: Image, label: 'Image' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Tools */}
          <div className="flex items-center space-x-2">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id as Tool)}
                  className={`p-2 rounded-md transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={tool.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Stroke Width */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-6">{strokeWidth}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Clear
          </button>
          <button
            onClick={exportCanvas}
            className="inline-flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="inline-flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="w-full h-full cursor-crosshair"
          style={{ backgroundColor: whiteboard.background_color }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
};
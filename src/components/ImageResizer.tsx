'use client';

import { useState, useRef, useEffect } from 'react';

type ImageAlign = 'left' | 'center' | 'right';

interface ImageResizerProps {
  src: string;
  alt: string;
  initialWidth?: number;
  initialAlign?: ImageAlign;
  onResize: (width: number, align: ImageAlign) => void;
  onClose: () => void;
}

export function ImageResizer({ src, alt, initialWidth, initialAlign, onResize, onClose }: ImageResizerProps) {
  const [width, setWidth] = useState(initialWidth || 500);
  const [height, setHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [align, setAlign] = useState<ImageAlign>(initialAlign || 'left');
  const [isDragging, setIsDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, width: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalHeight / img.naturalWidth;
      setAspectRatio(ratio);

      if (initialWidth) {
        setWidth(initialWidth);
        setHeight(Math.round(initialWidth * ratio));
      } else {
        // 기본값: 원본 크기가 500px 이상이면 500px로 제한
        const defaultWidth = img.naturalWidth > 500 ? 500 : img.naturalWidth;
        setWidth(defaultWidth);
        setHeight(Math.round(defaultWidth * ratio));
      }
    };
    img.src = src;
  }, [src, initialWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      width: width,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const newWidth = Math.max(100, Math.min(1200, dragStartRef.current.width + deltaX));
    setWidth(newWidth);
    setHeight(Math.round(newWidth * aspectRatio));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, width, aspectRatio]);

  const handleWidthChange = (newWidth: number) => {
    const clampedWidth = Math.max(100, Math.min(1200, newWidth));
    setWidth(clampedWidth);
    setHeight(Math.round(clampedWidth * aspectRatio));
  };

  const handleSave = () => {
    onResize(width, align);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            이미지 크기 조절
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 flex justify-center overflow-auto max-h-[60vh]">
          <div
            ref={containerRef}
            className="relative inline-block border-2 border-primary-500 rounded"
            style={{
              width: `${Math.min(width, 600)}px`,
              height: `${Math.min(height, 600 * aspectRatio)}px`,
              maxWidth: '100%'
            }}
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="w-full h-full object-contain"
              draggable={false}
            />

            {/* 리사이저 핸들 (우측 하단) */}
            <div
              onMouseDown={handleMouseDown}
              className={`absolute -right-2 -bottom-2 w-4 h-4 bg-primary-500 border-2 border-white rounded-full cursor-nwse-resize shadow-lg ${
                isDragging ? 'scale-125' : ''
              } transition-transform`}
            />
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                너비 (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                min="100"
                max="1200"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                높이 (px)
              </label>
              <input
                type="number"
                value={height}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              정렬
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setAlign('left')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  align === 'left'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h12" />
                  </svg>
                  <span>왼쪽</span>
                </div>
              </button>
              <button
                onClick={() => setAlign('center')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  align === 'center'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M6 18h12" />
                  </svg>
                  <span>가운데</span>
                </div>
              </button>
              <button
                onClick={() => setAlign('right')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  align === 'right'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M6 18h16" />
                  </svg>
                  <span>오른쪽</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            비율이 고정되어 있습니다 (가로 : 세로 = {(1 / aspectRatio).toFixed(2)} : 1)
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

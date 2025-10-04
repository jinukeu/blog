'use client';

import { useState, useCallback, useRef, DragEvent, ClipboardEvent, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
import { ImageResizer } from './ImageResizer';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type ImageAlign = 'left' | 'center' | 'right';

interface SelectedImage {
  src: string;
  alt: string;
  width?: number;
  align?: ImageAlign;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const insertImageMarkdown = (imageUrl: string, fileName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const imageMarkdown = `![${fileName}](${imageUrl})`;
    const newText = text.substring(0, start) + imageMarkdown + text.substring(end);

    onChange(newText);

    // 커서를 이미지 마크다운 뒤로 이동
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + imageMarkdown.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      for (const file of imageFiles) {
        try {
          const imageUrl = await uploadImage(file);
          insertImageMarkdown(imageUrl, file.name);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('이미지 업로드에 실패했습니다.');
        }
      }
    },
    [onChange]
  );

  const handlePaste = useCallback(
    async (e: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) => item.type.startsWith('image/'));

      if (imageItems.length === 0) return;

      e.preventDefault();

      for (const item of imageItems) {
        const file = item.getAsFile();
        if (!file) continue;

        try {
          const imageUrl = await uploadImage(file);
          const fileName = `pasted-image-${Date.now()}.${file.type.split('/')[1]}`;
          insertImageMarkdown(imageUrl, fileName);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('이미지 업로드에 실패했습니다.');
        }
      }
    },
    [onChange]
  );

  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // 프리뷰 영역의 이미지 클릭 이벤트 처리
  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const width = img.getAttribute('width') ? parseInt(img.getAttribute('width')!) : undefined;

        // style 속성에서 정렬 정보 추출
        const style = img.getAttribute('style') || '';
        let align: ImageAlign = 'left';
        if (style.includes('display: block') && style.includes('margin: 0 auto')) {
          align = 'center';
        } else if (style.includes('float: right')) {
          align = 'right';
        } else if (style.includes('float: left')) {
          align = 'left';
        }

        setSelectedImage({ src, alt, width, align });
      }
    };

    previewElement.addEventListener('click', handleImageClick);
    return () => {
      previewElement.removeEventListener('click', handleImageClick);
    };
  }, []);

  // 이미지 크기 조절 후 마크다운 업데이트
  const handleImageResize = (newWidth: number, align: ImageAlign) => {
    if (!selectedImage) return;

    const { src, alt } = selectedImage;

    // 정렬에 따른 style 속성 생성
    const getAlignStyle = (align: ImageAlign): string => {
      switch (align) {
        case 'center':
          return 'display: block; margin: 0 auto;';
        case 'right':
          return 'float: right; margin-left: 1rem;';
        case 'left':
        default:
          return 'float: left; margin-right: 1rem;';
      }
    };

    const alignStyle = getAlignStyle(align);

    // 마크다운과 HTML 이미지 패턴 모두 찾기
    const markdownPattern = new RegExp(`!\\[${escapeRegex(alt)}\\]\\(${escapeRegex(src)}\\)`, 'g');
    const htmlPattern = new RegExp(`<img[^>]*src="${escapeRegex(src)}"[^>]*>`, 'g');

    let newValue = value;

    // 마크다운 형식을 HTML로 변환
    if (markdownPattern.test(value)) {
      newValue = value.replace(
        markdownPattern,
        `<img src="${src}" width="${newWidth}" alt="${alt}" style="${alignStyle}" />`
      );
    }
    // 이미 HTML 형식이면 width와 style 속성 업데이트
    else if (htmlPattern.test(value)) {
      newValue = value.replace(htmlPattern, (match) => {
        // 기존 width와 style 속성 제거 후 새 값 추가
        const withoutAttrs = match
          .replace(/\s*width="\d+"\s*/g, ' ')
          .replace(/\s*style="[^"]*"\s*/g, ' ');
        return withoutAttrs.replace('<img', `<img width="${newWidth}" style="${alignStyle}"`);
      });
    }

    onChange(newValue);
    setSelectedImage(null);
  };

  // 정규식 이스케이프 헬퍼 함수
  const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* 에디터 */}
        <div className="relative h-full">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onPaste={handlePaste}
            placeholder={placeholder || '마크다운으로 작성하세요...\n\n이미지를 드래그 앤 드롭하거나 붙여넣기 할 수 있습니다.\n프리뷰에서 이미지를 클릭하면 크기를 조절할 수 있습니다.'}
            className={`w-full h-full p-4 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700 ${
              isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300'
            }`}
          />
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-50/80 dark:bg-primary-900/40 rounded-lg pointer-events-none">
              <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">이미지를 여기에 놓으세요</p>
            </div>
          )}
        </div>

        {/* 프리뷰 */}
        <div
          ref={previewRef}
          className="h-full overflow-y-auto p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <article className="prose prose-neutral dark:prose-invert max-w-none [&_img]:cursor-pointer [&_img]:hover:opacity-80 [&_img]:transition-opacity">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {value || '*프리뷰가 여기에 표시됩니다*'}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      {/* 이미지 크기 조절 모달 */}
      {selectedImage && (
        <ImageResizer
          src={selectedImage.src}
          alt={selectedImage.alt}
          initialWidth={selectedImage.width}
          initialAlign={selectedImage.align}
          onResize={handleImageResize}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

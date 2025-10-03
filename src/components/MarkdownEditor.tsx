'use client';

import { useState, useCallback, useRef, DragEvent, ClipboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
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
          placeholder={placeholder || '마크다운으로 작성하세요...\n\n이미지를 드래그 앤 드롭하거나 붙여넣기 할 수 있습니다.'}
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
      <div className="h-full overflow-y-auto p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {value || '*프리뷰가 여기에 표시됩니다*'}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

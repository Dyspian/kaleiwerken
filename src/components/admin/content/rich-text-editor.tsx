"use client";

import React, { useRef, useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className = "" }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const insertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    let newCursorPos = start;
    
    switch (tag) {
      case 'h2':
        newText = value.substring(0, start) + `\n## ${selectedText || 'Titel'}\n` + value.substring(end);
        newCursorPos = start + 4 + (selectedText ? selectedText.length : 5);
        break;
      case 'h3':
        newText = value.substring(0, start) + `\n### ${selectedText || 'Subtitel'}\n` + value.substring(end);
        newCursorPos = start + 5 + (selectedText ? selectedText.length : 8);
        break;
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText || 'vet'}**` + value.substring(end);
        newCursorPos = start + 2 + (selectedText ? selectedText.length : 3);
        break;
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText || 'cursief'}*` + value.substring(end);
        newCursorPos = start + 1 + (selectedText ? selectedText.length : 7);
        break;
      case 'list':
        newText = value.substring(0, start) + `\n- ${selectedText || 'Item'}\n` + value.substring(end);
        newCursorPos = start + 3 + (selectedText ? selectedText.length : 4);
        break;
      case 'link':
        newText = value.substring(0, start) + `[${selectedText || 'link tekst'}](url)` + value.substring(end);
        newCursorPos = start + 1 + (selectedText ? selectedText.length : 9);
        break;
    }
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const renderPreview = () => {
    return value
      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-brand-bronze hover:underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="border border-brand-dark/10 rounded-none bg-white">
        <div className="flex gap-2 p-3 border-b border-brand-dark/10 bg-brand-stone/30">
          <button
            type="button"
            onClick={() => insertTag('h2')}
            className="px-3 py-1 text-xs border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors"
            title="Hoofdtitel (H2)"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertTag('h3')}
            className="px-3 py-1 text-xs border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors"
            title="Subtitel (H3)"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertTag('bold')}
            className="px-3 py-1 text-xs border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors font-bold"
            title="Vet"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertTag('italic')}
            className="px-3 py-1 text-xs border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors italic"
            title="Cursief"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertTag('list')}
            className="px-3 py-1 text-xs border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors"
            title="Lijst"
          >
            • Lijst
          </button>
          <button
            type="button"
            onClick={() => insertTag('link')}
            className="px-3 py-1 text-xs border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors"
            title="Link"
          >
            Link
          </button>
        </div>
        
        <div className="flex">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              placeholder={placeholder || "Typ hier uw tekst..."}
              className="w-full p-4 min-h-[300px] border-none resize-none focus:outline-none focus:ring-0 font-sans leading-relaxed"
            />
          </div>
          
          <div className="w-px bg-brand-dark/10"></div>
          
          <div className="flex-1 p-4 bg-brand-stone/20 overflow-y-auto min-h-[300px]">
            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderPreview() }} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-brand-dark/50">
        <p>Gebruik markdown syntax: ## voor hoofdtitels, ### voor subtitels, **vet**, *cursief*, - voor lijsten, [tekst](url) voor links</p>
      </div>
    </div>
  );
};
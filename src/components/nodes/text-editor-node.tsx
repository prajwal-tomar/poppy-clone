"use client";

import { useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useBoardStore } from "@/stores/board-store";
import type { TextNodeData } from "@/types/node";

export function TextEditorNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as TextNodeData;
  const updateNodeData = useBoardStore((s) => s.updateNodeData);
  const removeNode = useBoardStore((s) => s.removeNode);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content: nodeData.content || "",
    onUpdate: ({ editor }) => {
      updateNodeData(id, { content: editor.getJSON() });
    },
    editorProps: {
      attributes: {
        class: "min-h-[160px] font-sans text-[15px] leading-[1.6] text-primary",
      },
    },
  });

  const setHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  if (!editor) return null;

  const activeHeading = editor.isActive("heading", { level: 1 })
    ? "H1"
    : editor.isActive("heading", { level: 2 })
      ? "H2"
      : editor.isActive("heading", { level: 3 })
        ? "H3"
        : "Text";

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="w-[320px] bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-secondary/40">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-muted-foreground hover:bg-white transition-colors">
              {activeHeading}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32">
            <DropdownMenuItem onClick={() => setHeading(1)}>
              <Heading1 className="size-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(2)}>
              <Heading2 className="size-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(3)}>
              <Heading3 className="size-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded transition-colors ${
            editor.isActive("bold")
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:bg-white"
          }`}
        >
          <Bold className="size-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded transition-colors ${
            editor.isActive("italic")
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:bg-white"
          }`}
        >
          <Italic className="size-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded transition-colors ${
            editor.isActive("bulletList")
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:bg-white"
          }`}
        >
          <List className="size-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded transition-colors ${
            editor.isActive("orderedList")
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:bg-white"
          }`}
        >
          <ListOrdered className="size-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:bg-white"
          }`}
        >
          <Code className="size-3.5" />
        </button>
      </div>
      <div className="p-4 nodrag nowheel cursor-text">
        <EditorContent editor={editor} />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !bg-border !border-white !border-2"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !bg-border !border-white !border-2"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !bg-border !border-white !border-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !bg-border !border-white !border-2"
      />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          onClick={() => removeNode(id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="size-4 mr-2" />
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

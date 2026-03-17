"use client";

import { useState, useRef, useCallback } from "react";
import {
  Play,
  FileText,
  ImageIcon,
  Mic,
  Type,
  Sparkles,
  Lock,
} from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/components/app/plan-provider";
import { UpgradeModal } from "@/components/app/upgrade-modal";

export function CanvasToolbar() {
  const { isPro } = usePlan();
  const { setNodes, screenToFlowPosition } = useReactFlow();

  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeHeadline, setUpgradeHeadline] = useState("");

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addNode = useCallback(
    (type: string) => {
      const center = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position: { x: center.x - 140, y: center.y - 100 },
        data: {},
      };
      setNodes((prev) => [...prev, newNode]);
    },
    [setNodes, screenToFlowPosition]
  );

  const openUpgrade = useCallback((headline: string) => {
    setUpgradeHeadline(headline);
    setUpgradeOpen(true);
  }, []);

  const handleYoutubeAdd = useCallback(() => {
    addNode("youtube");
    setYoutubeUrl("");
    setYoutubeOpen(false);
  }, [addNode]);

  const handlePdfClick = useCallback(() => {
    pdfInputRef.current?.click();
  }, []);

  const handlePdfSelect = useCallback(() => {
    addNode("pdf");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }, [addNode]);

  const handleImageClick = useCallback(() => {
    if (!isPro) {
      openUpgrade("Image upload is a Pro feature.");
      return;
    }
    imageInputRef.current?.click();
  }, [isPro, openUpgrade]);

  const handleImageSelect = useCallback(() => {
    addNode("image");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }, [addNode]);

  const handleVoiceClick = useCallback(() => {
    if (!isPro) {
      openUpgrade("Voice notes are a Pro feature.");
      return;
    }
    setVoiceOpen(true);
  }, [isPro, openUpgrade]);

  const handleVoiceStop = useCallback(() => {
    addNode("voiceNote");
    setVoiceOpen(false);
  }, [addNode]);

  return (
    <>
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        headline={upgradeHeadline}
      />

      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handlePdfSelect}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      <TooltipProvider delayDuration={200}>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 bg-white border border-border rounded-full shadow-md px-3 py-2">
            {/* YouTube */}
            <Popover open={youtubeOpen} onOpenChange={setYoutubeOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button className="relative size-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
                      <Play className="size-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">YouTube</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-72 p-3" side="top" sideOffset={12}>
                <p className="font-sans text-xs font-medium mb-2">
                  Add YouTube Video
                </p>
                <div className="flex gap-2">
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Paste a YouTube URL..."
                    className="h-8 text-xs rounded-md"
                  />
                  <Button
                    onClick={handleYoutubeAdd}
                    size="sm"
                    className="h-8 rounded-md bg-primary text-primary-foreground hover:bg-[#333333] text-xs px-3"
                  >
                    Add
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* PDF */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handlePdfClick}
                  className="relative size-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                >
                  <FileText className="size-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">PDF</p>
              </TooltipContent>
            </Tooltip>

            {/* Image */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleImageClick}
                  className="relative size-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                >
                  <ImageIcon className="size-4 text-muted-foreground" />
                  {!isPro && (
                    <Lock className="size-2.5 text-muted-foreground/60 absolute bottom-0.5 right-0.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {!isPro ? "Upgrade to Pro to use Image" : "Image"}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Voice Note */}
            <Popover open={voiceOpen} onOpenChange={setVoiceOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      onClick={handleVoiceClick}
                      className="relative size-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                    >
                      <Mic className="size-4 text-muted-foreground" />
                      {!isPro && (
                        <Lock className="size-2.5 text-muted-foreground/60 absolute bottom-0.5 right-0.5" />
                      )}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {!isPro ? "Upgrade to Pro to use Voice Note" : "Voice Note"}
                  </p>
                </TooltipContent>
              </Tooltip>
              {isPro && (
                <PopoverContent className="w-56 p-4" side="top" sideOffset={12}>
                  <p className="font-sans text-xs font-medium mb-3 text-center">
                    Voice Recording
                  </p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                      <Mic className="size-5 text-white" />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">
                      0:02
                    </span>
                    <Button
                      onClick={handleVoiceStop}
                      size="sm"
                      className="rounded-full bg-primary text-primary-foreground hover:bg-[#333333] text-xs px-4"
                    >
                      Stop & Add
                    </Button>
                  </div>
                </PopoverContent>
              )}
            </Popover>

            {/* Text */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => addNode("textEditor")}
                  className="relative size-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                >
                  <Type className="size-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Text</p>
              </TooltipContent>
            </Tooltip>

            {/* AI Chat */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => addNode("aiChat")}
                  className="relative size-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                >
                  <Sparkles className="size-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">AI Chat</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

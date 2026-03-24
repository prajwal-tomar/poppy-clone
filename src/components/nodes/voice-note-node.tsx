"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Play,
  Pause,
  Mic,
  Square,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  FileText,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useBoardStore } from "@/stores/board-store";
import { uploadAudio } from "@/lib/actions/file-actions";
import type { VoiceNoteNodeData } from "@/types/node";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceNoteNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as VoiceNoteNodeData;
  const updateNodeData = useBoardStore((s) => s.updateNodeData);
  const removeNode = useBoardStore((s) => s.removeNode);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(
    nodeData.duration || 0
  );
  const [recordingTime, setRecordingTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcribeCalledRef = useRef(false);

  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      updateNodeData(id, { status: "transcribing" });

      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();

        if (!res.ok) {
          updateNodeData(id, { status: "failed" });
          return;
        }

        updateNodeData(id, {
          transcript: json.transcript,
          status: "completed",
        });
      } catch {
        updateNodeData(id, { status: "failed" });
      }
    },
    [id, updateNodeData]
  );

  const transcribeFromUrl = useCallback(
    async (fileUrl: string) => {
      try {
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        await transcribeAudio(blob);
      } catch {
        updateNodeData(id, { status: "failed" });
      }
    },
    [id, updateNodeData, transcribeAudio]
  );

  useEffect(() => {
    if (
      nodeData.status === "transcribing" &&
      nodeData.fileUrl &&
      !nodeData.transcript &&
      !transcribeCalledRef.current
    ) {
      transcribeCalledRef.current = true;
      transcribeFromUrl(nodeData.fileUrl);
    }
  }, [nodeData.status, nodeData.fileUrl, nodeData.transcript, transcribeFromUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const duration = recordingTime;

        updateNodeData(id, { status: "transcribing", duration });

        const formData = new FormData();
        formData.append("file", blob, "recording.webm");
        const uploadResult = await uploadAudio(formData);

        if ("error" in uploadResult) {
          updateNodeData(id, { status: "failed" });
          return;
        }

        updateNodeData(id, { fileUrl: uploadResult.url });
        await transcribeAudio(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);

      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      updateNodeData(id, { status: "recording" });
    } catch {
      updateNodeData(id, { status: "failed" });
    }
  }, [id, updateNodeData, transcribeAudio, recordingTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (nodeData.status === "recording" && !mediaRecorderRef.current) {
      startRecording();
    }
  }, [nodeData.status, startRecording]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) {
      if (!nodeData.fileUrl) return;
      const audio = new Audio(nodeData.fileUrl);
      audioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        setPlaybackProgress(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        setPlaybackDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, nodeData.fileUrl]);

  const handleRetry = () => {
    transcribeCalledRef.current = false;
    updateNodeData(id, { status: "transcribing" });
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const status = nodeData.status;
  const progressPercent =
    playbackDuration > 0 ? (playbackProgress / playbackDuration) * 100 : 0;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="w-[260px] bg-white border border-border rounded-lg shadow-sm p-3 relative">
        {status === "recording" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <button
              onClick={stopRecording}
              className="size-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse"
            >
              <Square className="size-4 text-white" fill="white" />
            </button>
            <span className="font-mono text-sm text-muted-foreground">
              {formatDuration(recordingTime)}
            </span>
            <p className="font-sans text-[11px] text-red-500 font-medium">
              Recording...
            </p>
          </div>
        )}

        {status === "transcribing" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="size-8 text-muted-foreground animate-spin" />
            <p className="font-sans text-xs text-muted-foreground">
              Transcribing audio...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <AlertCircle className="size-8 text-red-400" />
            <p className="font-sans text-xs text-red-600">
              Transcription failed
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 font-sans text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          </div>
        )}

        {status === "completed" && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={togglePlayback}
                className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/80 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="size-3.5 text-white" />
                ) : (
                  <Play className="size-3.5 text-white ml-0.5" fill="white" />
                )}
              </button>
              <div className="flex-1">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <span className="font-sans text-xs text-muted-foreground shrink-0">
                {formatDuration(
                  isPlaying ? playbackProgress : nodeData.duration || playbackDuration
                )}
              </span>
            </div>
            {nodeData.transcript && (
              <p
                className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 cursor-pointer"
                onDoubleClick={() => setSheetOpen(true)}
              >
                {nodeData.transcript}
              </p>
            )}
            <p className="font-sans text-[11px] text-muted-foreground/60 mt-2">
              Voice Note —{" "}
              {formatDuration(nodeData.duration || playbackDuration)}
            </p>
          </>
        )}

        {!status && (
          <div className="flex flex-col items-center gap-3 py-4">
            <button
              onClick={startRecording}
              className="size-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <Mic className="size-5 text-white" />
            </button>
            <p className="font-sans text-xs text-muted-foreground">
              Click to start recording
            </p>
          </div>
        )}

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
          {status === "completed" && nodeData.transcript && (
            <ContextMenuItem onClick={() => setSheetOpen(true)}>
              <FileText className="size-4 mr-2" />
              View Transcript
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => removeNode(id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="size-4 mr-2" />
            Delete Node
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-heading text-lg">
              Voice Note Transcript
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {nodeData.duration && (
              <p className="font-sans text-sm text-muted-foreground mb-4">
                Duration: {formatDuration(nodeData.duration)}
              </p>
            )}
            <p className="font-sans text-sm leading-relaxed text-primary whitespace-pre-wrap">
              {nodeData.transcript}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

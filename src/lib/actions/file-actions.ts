"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const PDF_MAX_SIZE = 20 * 1024 * 1024; // 20MB
const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const AUDIO_MAX_SIZE = 25 * 1024 * 1024; // 25MB

const PDF_MIME_TYPES = ["application/pdf"];
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
];

// 1 year in seconds for signed URLs
const SIGNED_URL_EXPIRY = 365 * 24 * 60 * 60;

interface UploadResult {
  url: string;
  path: string;
}

interface UploadError {
  error: string;
}

async function uploadFile(
  formData: FormData,
  bucket: string,
  maxSize: number,
  allowedMimeTypes: string[]
): Promise<UploadResult | UploadError> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { error: "No file provided" };
  }

  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return { error: `File too large. Maximum size is ${maxMB}MB.` };
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return { error: `Invalid file type: ${file.type}` };
  }

  const fileExt = file.name.split(".").pop() ?? "bin";
  const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError || !data) {
    return { error: `Upload failed: ${uploadError?.message ?? "Unknown error"}` };
  }

  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(data.path, SIGNED_URL_EXPIRY);

  if (urlError || !signedUrlData) {
    return { error: `Failed to generate URL: ${urlError?.message ?? "Unknown error"}` };
  }

  return {
    url: signedUrlData.signedUrl,
    path: data.path,
  };
}

export async function uploadPDF(
  formData: FormData
): Promise<UploadResult | UploadError> {
  return uploadFile(formData, "pdfs", PDF_MAX_SIZE, PDF_MIME_TYPES);
}

export async function uploadImage(
  formData: FormData
): Promise<UploadResult | UploadError> {
  return uploadFile(formData, "images", IMAGE_MAX_SIZE, IMAGE_MIME_TYPES);
}

export async function uploadAudio(
  formData: FormData
): Promise<UploadResult | UploadError> {
  return uploadFile(formData, "audio", AUDIO_MAX_SIZE, AUDIO_MIME_TYPES);
}

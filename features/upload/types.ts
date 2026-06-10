export interface UploadedDocument {
  id: string;
  name: string;
  uploadedAt: Date | string;
  type: "pdf" | "text";
  status: "uploading" | "ready" | "error";
}

export interface UploadedDocument {
  id: string;
  name: string;
  uploadedAt: Date;
  type: "pdf" | "text";
  status: "uploading" | "ready" | "error";
}

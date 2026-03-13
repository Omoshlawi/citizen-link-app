import mime from "mime";
import { apiFetch } from "./apiFetch";
import { constructUrl } from "./constructUrl";
import handleApiErrors from "./handleApiErrors";

export const uploadFile = async (
  fileUri: string,
  onProgress?: (percent: number) => void,
): Promise<string> => {
  try {
    const fileName = fileUri.split("/").pop();

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: mime.getType(fileUri) || "application/octet-stream",
      name: fileName,
    } as any);

    const url = constructUrl("/files/upload");

    const {
      data: { key },
    } = await apiFetch(url, {
      method: "POST",
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress?.(percent);
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return key;
  } catch (err: any) {
    const errorDetail = handleApiErrors(err)?.detail;
    throw new Error(
      `Upload failed for ${fileUri}: ${errorDetail}`,
      { cause: err }, // Preserves original stack trace!
    );
  }
};

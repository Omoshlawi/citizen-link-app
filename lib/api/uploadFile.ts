import mime from "mime";
import RNBlobUtil from "react-native-blob-util";
import { apiFetch } from "./apiFetch";
import { constructUrl } from "./constructUrl";

export const uploadFile = async (
  fileUri: string,
  onProgress?: (percent: number) => void
): Promise<string> => {
  try {
    const path = fileUri.replace(/^file:\/\//i, "");

    const { size } = await RNBlobUtil.fs.stat(path);

    const fileName = path.split(/[\\/]/).pop() || "upload";

    const mimeType = mime.getType(path) || "application/octet-stream";

    const url = constructUrl("/files/upload-url", {
      fileName,
      size,
      mimeType,
    });

    const {
      data: { url: signedUrl, key },
    } = await apiFetch<{ url: string; key: string }>(url);

    await RNBlobUtil.fetch(
      "PUT",
      signedUrl,
      {
        "Content-Type": mimeType,
      },
      RNBlobUtil.wrap(path)
    )
      .uploadProgress((written, total) => {
        onProgress?.(Math.floor((written / total) * 100));
      })
      .progress((received, total) => {
        // optional - download progress if you ever reuse for GET
      });

    return key;
  } catch (err: any) {
    throw new Error(`Upload failed for ${fileUri}: ${err.message}`);
  }
};

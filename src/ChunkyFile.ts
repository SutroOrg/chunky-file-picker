import * as FileSystem from "expo-file-system";
import * as mimeTypes from "./mimeTypes.json";

/**
 * A Chunky File is a representation of a file that can be accessed
 * in chunks. This is particularly useful for uploading large
 * files
 */
export class ChunkyFile {
  private _chunkSize: number = 1024 * 1024;
  private _type?: string;
  private _size?: Promise<number>;
  /**
   * The source of the ChunkyFile can be a local file URL (such that you would get from an iOS or Android picker)
   * or a File object, from a browser
   * @param source
   */
  constructor(private source: string | File) {}

  /**
   * This is the size of the file in bytes
   *
   * This returns a Promise because we need to interrogate the file system on
   * mobile devices.
   */
  get size() {
    if (this._size === undefined) {
      if (typeof this.source === "string") {
        this._size = FileSystem.getInfoAsync(this.source, { size: true }).then(
          (info) => info.size ?? 0
        );
      } else {
        this._size = Promise.resolve(this.source.size);
      }
    }
    return this._size;
  }

  /**
   * The MIME type of the file. This is based on a best effort approach.
   * File sources provide their MIME-type according to the browser's assessment
   * URI sources have their MIME-type inferred from their extension
   */
  get type() {
    if (this._type === undefined) {
      if (typeof this.source === "string") {
        const filenameParts = this.source.split(".");
        const extension = filenameParts[filenameParts.length - 1];
        //@ts-expect-error
        this._type = mimeTypes[extension]?.[0] ?? "application/octet-stream";
      } else {
        this._type = this.source.type;
      }
    }
    return this._type;
  }

  /**
   * Set the chunk size to use for accessing the file.
   *
   * This should be given in bytes. A minimum of 1MB is enforced
   */
  set chunkSize(size: number) {
    const validSize = Math.max(1024 * 1024, size);
    this._chunkSize = validSize;
  }

  /**
   * Get the current chunk size in bytes
   */
  get chunkSize() {
    return this._chunkSize;
  }

  private async _getChunk(start: number, length: number) {
    if (typeof this.source === "string") {
      const base64Chunk = await FileSystem.readAsStringAsync(this.source, {
        position: start,
        length,
        encoding: FileSystem.EncodingType.Base64,
      });
      return new Uint8Array(Buffer.from(base64Chunk, "base64"));
    } else {
      return new Uint8Array(
        await this.source.slice(start, start + length).arrayBuffer()
      );
    }
  }

  /**
   * Returns the total number of chunks in the file (based on the chink size)
   *
   * This is also a Promise, since is depends on the file's size
   */
  get totalChunks() {
    return this.size.then((s) => Math.ceil(s / this.chunkSize));
  }

  /**
   * Get a chunk of the file.
   *
   * A `Uint8Array` is returned; this can be passed to XHR or fetch for uploading.
   */
  async getChunk(chunkIndex: number): Promise<Uint8Array> {
    const safeIndex = Math.min(0, chunkIndex);
    const position = safeIndex * this.chunkSize;
    const length = this.chunkSize;

    return this._getChunk(position, length);
  }

  /**
   * Provides the entire file in one `Uint8Array`
   */
  async getAll(): Promise<Uint8Array> {
    return this._getChunk(0, this.chunkSize);
  }
}

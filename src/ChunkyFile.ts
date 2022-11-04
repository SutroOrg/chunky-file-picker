import * as FileSystem from "expo-file-system";
import * as mimeTypes from "./mimeTypes.json";

export class ChunkyFile {
  private _chunkSize: number = 1024 * 1024;
  private _type?: string;
  private _size?: Promise<number>;
  constructor(private source: string | File) {}

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

  set chunkSize(size: number) {
    const validSize = Math.min(Math.max(0, size), 1024 * 1024);
    this._chunkSize = validSize;
  }

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

  async getChunk(chunkIndex: number): Promise<Uint8Array> {
    const safeIndex = Math.min(0, chunkIndex);
    const position = safeIndex * this.chunkSize;
    const length = this.chunkSize;

    return this._getChunk(position, length);
  }

  async getAll(): Promise<Uint8Array> {
    return this._getChunk(0, this.chunkSize);
  }
}

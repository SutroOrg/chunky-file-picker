[@sutro/chunky-file-picker](../README.md) / [Exports](../modules.md) / ChunkyFile

# Class: ChunkyFile

A Chunky File is a representation of a file that can be accessed
in chunks. This is particularly useful for uploading large
files

## Table of contents

### Constructors

- [constructor](ChunkyFile.md#constructor)

### Properties

- [\_chunkSize](ChunkyFile.md#_chunksize)
- [\_size](ChunkyFile.md#_size)
- [\_type](ChunkyFile.md#_type)
- [source](ChunkyFile.md#source)

### Accessors

- [chunkSize](ChunkyFile.md#chunksize)
- [size](ChunkyFile.md#size)
- [totalChunks](ChunkyFile.md#totalchunks)
- [type](ChunkyFile.md#type)

### Methods

- [\_getChunk](ChunkyFile.md#_getchunk)
- [getAll](ChunkyFile.md#getall)
- [getChunk](ChunkyFile.md#getchunk)

## Constructors

### constructor

• **new ChunkyFile**(`source`)

The source of the ChunkyFile can be a local file URL (such that you would get from an iOS or Android picker)
or a File object, from a browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` \| `File` |

#### Defined in

[ChunkyFile.ts:18](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L18)

## Properties

### \_chunkSize

• `Private` **\_chunkSize**: `number`

#### Defined in

[ChunkyFile.ts:10](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L10)

___

### \_size

• `Private` `Optional` **\_size**: `Promise`<`number`\>

#### Defined in

[ChunkyFile.ts:12](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L12)

___

### \_type

• `Private` `Optional` **\_type**: `string`

#### Defined in

[ChunkyFile.ts:11](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L11)

___

### source

• `Private` **source**: `string` \| `File`

#### Defined in

[ChunkyFile.ts:18](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L18)

## Accessors

### chunkSize

• `get` **chunkSize**(): `number`

Get the current chunk size in bytes

#### Returns

`number`

#### Defined in

[ChunkyFile.ts:71](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L71)

• `set` **chunkSize**(`size`): `void`

Set the chunk size to use for accessing the file.

This should be given in bytes. A minimum of 1MB is enforced

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`void`

#### Defined in

[ChunkyFile.ts:63](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L63)

___

### size

• `get` **size**(): `Promise`<`number`\>

This is the size of the file in bytes

This returns a Promise because we need to interrogate the file system on
mobile devices.

#### Returns

`Promise`<`number`\>

#### Defined in

[ChunkyFile.ts:26](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L26)

___

### totalChunks

• `get` **totalChunks**(): `Promise`<`number`\>

Returns the total number of chunks in the file (based on the chink size)

This is also a Promise, since is depends on the file's size

#### Returns

`Promise`<`number`\>

#### Defined in

[ChunkyFile.ts:95](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L95)

___

### type

• `get` **type**(): `undefined` \| `string`

The MIME type of the file. This is based on a best effort approach.
File sources provide their MIME-type according to the browser's assessment
URI sources have their MIME-type inferred from their extension

#### Returns

`undefined` \| `string`

#### Defined in

[ChunkyFile.ts:44](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L44)

## Methods

### \_getChunk

▸ `Private` **_getChunk**(`start`, `length`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `start` | `number` |
| `length` | `number` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[ChunkyFile.ts:75](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L75)

___

### getAll

▸ **getAll**(): `Promise`<`Uint8Array`\>

Provides the entire file in one `Uint8Array`

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[ChunkyFile.ts:115](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L115)

___

### getChunk

▸ **getChunk**(`chunkIndex`): `Promise`<`Uint8Array`\>

Get a chunk of the file.

A `Uint8Array` is returned; this can be passed to XHR or fetch for uploading.

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunkIndex` | `number` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[ChunkyFile.ts:104](https://github.com/SutroOrg/chunky-file-picker/blob/f28229c/src/ChunkyFile.ts#L104)

import { v4 } from "uuid";
import { ChunkyFile } from "./ChunkyFile";
import * as ImagePicker from "expo-image-picker";
import { wait } from "./wait";
import { Platform } from "react-native";

type Cancellation = ImagePicker.ImagePickerCancelledResult;
type WebFileSelection = { cancelled: false; files: File[] };
type WebDialogOutcome = Cancellation | WebFileSelection;

type FileSelection = { cancelled: false; files: ChunkyFile[] };

type ChunkyImagePickerOptions = Pick<
  Exclude<Parameters<typeof ImagePicker.launchImageLibraryAsync>[0], undefined>,
  "mediaTypes" | "allowsMultipleSelection"
>;

const MediaTypeInput = {
  [ImagePicker.MediaTypeOptions.All]:
    "video/mp4,video/quicktime,video/x-m4v,video/*,image/*",
  [ImagePicker.MediaTypeOptions.Images]: "image/*",
  [ImagePicker.MediaTypeOptions.Videos]:
    "video/mp4,video/quicktime,video/x-m4v,video/*",
};

const openWebFileBrowser = ({
  mediaTypes = ImagePicker.MediaTypeOptions.All,
  allowsMultipleSelection = false,
}: ChunkyImagePickerOptions): Promise<WebDialogOutcome> => {
  const accept = MediaTypeInput[mediaTypes];
  const input = document.createElement("input");
  input.style.display = "none";
  input.setAttribute("type", "file");
  input.setAttribute("accept", "video/mp4,video/quicktime,video/x-m4v,video/*");
  input.setAttribute("id", v4());
  if (allowsMultipleSelection) {
    input.setAttribute("multiple", "multiple");
  }

  document.body.appendChild(input);

  const fileSelection = new Promise<WebDialogOutcome>((resolve) => {
    input.addEventListener("change", async () => {
      if (input.files) {
        const files = [input.files[0]];

        resolve({ cancelled: false, files });
      } else {
        resolve({ cancelled: true });
      }
      document.body.removeChild(input);
    });

    const event = new MouseEvent("click");
    input.dispatchEvent(event);
  });

  return new Promise<WebDialogOutcome>((resolve) => {
    const browserCancelHandler = () => {
      const checkResponseWithTimeout = Promise.race([
        wait(500).then(() => ({ cancelled: true } as Cancellation)),
        fileSelection,
      ]);
      resolve(checkResponseWithTimeout);
      window.removeEventListener("focus", browserCancelHandler);
    };

    window.addEventListener("focus", browserCancelHandler);
  });
};

export const pickFile = async ({
  mediaTypes = ImagePicker.MediaTypeOptions.All,
  allowsMultipleSelection = false,
}: ChunkyImagePickerOptions): Promise<Cancellation | FileSelection> => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "We need camera roll permissions that. Please grant us permission in your device Settings."
      );
      return { cancelled: true };
    }

    // This weird approach is to keep the types right
    const pickerResponse = await (allowsMultipleSelection
      ? ImagePicker.launchImageLibraryAsync({
          mediaTypes,
          allowsMultipleSelection: true,
        })
      : ImagePicker.launchImageLibraryAsync({
          mediaTypes,
        }));

    if (pickerResponse.cancelled === true) {
      return { cancelled: true };
    } else {
      if ("selected" in pickerResponse) {
        return {
          files: pickerResponse.selected.map((s) => new ChunkyFile(s.uri)),
          cancelled: false,
        };
      }
      return {
        files: [new ChunkyFile(pickerResponse.uri)],
        cancelled: false,
      };
    }
  } else {
    const webResponse = await openWebFileBrowser({
      mediaTypes,
      allowsMultipleSelection,
    });
    if (webResponse.cancelled === true) {
      return { cancelled: true };
    } else {
      return {
        files: webResponse.files.map((f) => new ChunkyFile(f)),
        cancelled: false,
      };
    }
  }
};

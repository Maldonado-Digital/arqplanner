import * as FileSystem from 'expo-file-system'

export async function downloadFile(fileUri: string) {
  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
    console.log('Download Progress: ', progress)
  }

  const downloadResumable = FileSystem.createDownloadResumable(
    fileUri,
    `${FileSystem.documentDirectory}${fileUri.split('/').pop()}`,
    {},
    callback,
  )

  const response =
    (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult

  return response
}

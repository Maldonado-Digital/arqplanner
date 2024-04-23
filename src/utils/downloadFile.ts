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

  const { uri } =
    (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult
  console.log('Finished downloading to ', uri)
}

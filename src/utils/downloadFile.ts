import * as FileSystem from 'expo-file-system'

export async function downloadFile(fileUri: string) {
  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
    console.log('Download Progress: ', progress)
  }
  const outputDir = `${FileSystem.documentDirectory}/ArqPlanner/${fileUri.split('/').pop()}`

  const directoryInfo = await FileSystem.getInfoAsync(outputDir)
  if (!directoryInfo.exists) {
    console.log("ArqPlanner directory doesn't exist, creating…")
    await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true })
  }

  const downloadResumable = FileSystem.createDownloadResumable(
    fileUri,
    `${FileSystem.documentDirectory}${fileUri.split('/').pop()}`,
    {},
    callback,
  )

  const response =
    (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult

  console.log(response)
  return response
}

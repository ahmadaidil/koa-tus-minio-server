exports.getFileInfo = (file) => {
  const fileExt = getFilenameAndExt(file.upload_metadata);
  const length = file.upload_length;
  delete file.upload_length;
  delete file.upload_metadata;
  return {
    ...file,
    ...fileExt,
    length
  };
};

const getFilenameAndExt = (uploadMetadata) => {
  const filename = unparseMetadataString(uploadMetadata);
  const filenameArr = filename.split('.');
  const extension = filenameArr[filenameArr.length - 1];
  return {
    filename,
    extension
  };  
}

const unparseMetadataString = (uploadMetadata) => (
  Buffer.from(getBase64Code(uploadMetadata), 'base64').toString('ascii')
);

const getBase64Code = (uploadMetadata) => (
  uploadMetadata.split(' ')[1]
);

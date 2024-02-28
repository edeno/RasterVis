import sendRequestToParent from './sendRequestToParent';
import deserializeReturnValue from './deserializeReturnValue';

const getFileData = (
  uri,
  responseType,
  onProgress,
  o = {}
) => {
  let responseType2
  if (responseType === 'json-deserialized') {
    responseType2 = 'json'
  }
  else {
    responseType2 = responseType
  }
  const request = {
    type: 'getFileData',
    uri,
    responseType: responseType2,
    figurlProtocolVersion: 'p1'
  };
  if (o.startByte !== undefined) {
    request.startByte = o.startByte;
    request.endByte = o.endByte;
  }
  progressListeners[uri] = ({ loaded, total }) => {
    onProgress({ loaded, total });
  };
  return new Promise((resolve, reject) => {
    sendRequestToParent(request).then(response => {
      if (!isGetFileDataResponse(response)) throw Error('Invalid response to getFigureData');
      if (response.errorMessage) {
        throw Error(`Error getting file data for ${uri}: ${response.errorMessage}`);
      }
      if (responseType === 'json-deserialized') {
        resolve(deserializeReturnValue(response.fileData));
      }
      else {
        resolve(response.fileData);
      }
    })
    .catch((err) => {
      reject(err);
    })
  })
};

export const getFileDataUrl = (uri) => {
  const request = {
    type: 'getFileDataUrl',
    uri,
    figurlProtocolVersion: 'p1'
  };
  return new Promise((resolve, reject) => {
    sendRequestToParent(request).then(response => {
      if (!isGetFileDataUrlResponse(response)) throw Error('Invalid response to getFigureUrlData');
      if (!response.fileDataUrl || response.errorMessage) {
        throw Error(`Error getting file data for ${uri}: ${response.errorMessage}`);
      }
      resolve(response.fileDataUrl);
    })
    .catch((err) => {
      reject(err);
    })
  })
}

// export const storeFileData = async (fileData, o = {}) => {
//   const request = {
//     type: 'storeFile',
//     fileData,
//     figurlProtocolVersion: 'p1'
//   };
//   const response = await sendRequestToParent(request);
//   if (!isStoreFileResponse(response)) throw Error('Invalid response to storeFile');
//   if (response.error) {
//     throw Error(`Error storing file data: ${response.error}`);
//   }
//   if (response.uri === undefined) {
//     throw Error('Unexpected response.uri is undefined');
//   }
//   return response.uri;
// };

// export const storeGithubFileData = async (o) => {
//   const request = {
//     type: 'storeGithubFile',
//     fileData: o.fileData,
//     uri: o.uri,
//     figurlProtocolVersion: 'p1'
//   };
//   const response = await sendRequestToParent(request);
//   if (!isStoreGithubFileResponse(response)) throw Error('Invalid response to storeFile');
//   if (response.error) {
//     throw Error(`Error storing file data: ${response.error}`);
//   }
// };

const progressListeners = {};

export const handleFileDownloadProgress = ({
  uri,
  loaded,
  total,
}) => {
  const x = progressListeners[uri];
  if (x) {
    x({ loaded, total });
  }
};

// export const useFileData = (uri, responseType, o = {}) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [fileData, setFileData] = useState<any | undefined>(undefined);
//   const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
//   const { progress, reportProgress } = useMemo(() => {
//     let _callback = ({ loaded, total }) => {};
//     const reportProgress = (a) => {
//       _callback(a);
//     };
//     const progress = {
//       onProgress: (callback) => {
//         _callback = callback;
//       },
//     };
//     return { progress, reportProgress };
//   }, []);
//   useEffect(() => {
//     setErrorMessage(undefined);
//     setFileData(undefined);
//     getFileData(uri, responseType, reportProgress, {
//       startByte: o.startByte,
//       endByte: o.endByte
//     })
//       .then((data) => {
//         setFileData(data);
//       })
//       .catch((err) => {
//         setErrorMessage(err.message);
//       });
//   }, [uri, reportProgress, o.startByte, o.endByte, responseType]);
//   return { fileData, progress, errorMessage };
// };

export default getFileData;

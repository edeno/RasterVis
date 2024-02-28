import { handleFigurlResponse } from './sendRequestToParent';
import { handleFileDownloadProgress } from './getFileData';
// import { handleReportUrlStateChange } from './SetupUrlState';

// const urlSearchParams = new URLSearchParams(window.location.search)
// const queryParams = Object.fromEntries(urlSearchParams.entries())

const handleSetCurrentUser = (o) => {
  console.warn('Not implemented: handleSetCurrentUser', o);
};

function parseQuery(queryString) {
  const ind = queryString.indexOf('?');
  if (ind < 0) return {};
  const query = {};
  const pairs = queryString.slice(ind + 1).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

// Important to do it this way because it is difficult to handle special characters (especially #) by using URLSearchParams or window.location.search
const queryParams = parseQuery(window.location.href);

// if (!queryParams.parentOrigin) {
//     // self-contained bundle
//     const s = document.createElement("script");
//     s.setAttribute("src", "figurlData.js");
//     document.body.appendChild(s);
// }

const startListeningToParent = () => {
  window.addEventListener('message', (e) => {
    const msg = e.data;
    if (!msg) return;
    const messageToChildTypes = ['figurlResponse', 'setCurrentUser', 'fileDownloadProgress', 'reportUrlStateChange']
    const messageToParentTypes = ['figurlRequest']
    if (messageToChildTypes.includes(msg.type)) {
      if (msg.type === 'figurlResponse') {
        handleFigurlResponse(msg);
      } else if (msg.type === 'setCurrentUser') {
        handleSetCurrentUser({
          userId: msg.userId,
          googleIdToken: msg.googleIdToken,
        });
      } else if (msg.type === 'fileDownloadProgress') {
        handleFileDownloadProgress({
          uri: msg.uri,
          loaded: msg.loaded,
          total: msg.total,
        });
      } else if (msg.type === 'reportUrlStateChange') {
        console.warn('Not supported: reportUrlStateChange')
        // handleReportUrlStateChange(msg.state);
      }
    } else if (messageToParentTypes.includes(msg.type)) {
      // this is relevant for standalone (self-contained) figures
      if (queryParams.parentOrigin) {
        console.warn('Got message to parent even though parentOrigin is defined');
        return;
      }
      if (msg.type === 'figurlRequest') {
        const req = msg.request;
        if (req.type === 'getFigureData') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const figureData = (window).figurlData.figure;
          const resp = {
            type: 'getFigureData',
            figureData,
          };
          const msg2 = {
            type: 'figurlResponse',
            requestId: msg.requestId,
            response: resp,
          };
          window.postMessage(msg2, '*');
        } else if (req.type === 'getFileData') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fileData = (window).figurlData.uri[req.uri];
          const resp = {
            type: 'getFileData',
            fileData,
          };
          const msg2 = {
            type: 'figurlResponse',
            requestId: msg.requestId,
            response: resp,
          };
          window.postMessage(msg2, '*');
        }
      }
    } else {
      console.warn('Unhandled message from parent', e);
    }
  });
};

export default startListeningToParent;

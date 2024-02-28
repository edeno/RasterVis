import sendMessageToParent from './sendMessageToParent';

// const urlSearchParams = new URLSearchParams(window.location.search)
// const queryParams = Object.fromEntries(urlSearchParams.entries())

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

const pendingRequests = {};

export const handleFigurlResponse = (msg) => {
  const requestId = msg.requestId;
  const response = msg.response;
  if (requestId in pendingRequests) {
    pendingRequests[requestId].onResponse(response);
    delete pendingRequests[requestId];
  }
};

let initalizationData = undefined;
const _initializationCallbacks = [];
window.addEventListener('message', (e) => {
  if (initalizationData) return;
  const msg = e.data;
  if (msg.type === 'initializeFigure') {
    initalizationData = {
      parentOrigin: msg.parentOrigin,
      figureId: msg.figureId,
      s: msg.s,
    };
    _initializationCallbacks.forEach((cb) => {
      cb();
    });
  }
});

const onInitialized = (callback) => {
  if (initalizationData) {
    callback();
  } else {
    _initializationCallbacks.push(callback);
  }
};

export const waitForInitialization = () => {
  return new Promise((resolve, reject) => {
    const figureId = queryParams.figureId;
    const parentOrigin = queryParams.parentOrigin;
    const s = queryParams.s || '';
    if (figureId !== undefined && parentOrigin !== undefined) {
      resolve({ parentOrigin, figureId, s });
    } else {
      onInitialized(() => {
        if (!initalizationData) throw Error('unexpected');
        resolve({
          parentOrigin: initalizationData.parentOrigin,
          figureId: initalizationData.figureId,
          s: initalizationData.s,
        });
      });
    }
  });
};

const sendRequestToParent = (request) => {
  return new Promise((resolve, reject) => {
    waitForInitialization().then(({ figureId, parentOrigin }) => {
      const requestId = randomAlphaString(10);
      let completed = false;
      pendingRequests[requestId] = {
        onResponse: (response) => {
          if (completed) return;
          completed = true;
          resolve(response);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err) => {
          if (completed) return;
          completed = true;
          reject(err);
        },
      };
      const msg = {
        type: 'figurlRequest',
        figureId,
        requestId,
        request,
      };
      sendMessageToParent(msg, { parentOrigin });
    })
    .catch((err) => {
      reject(err);
    });
  });
};

export const randomAlphaString = (num_chars) => {
  if (!num_chars) {
    throw Error('randomAlphaString: num_chars needs to be a positive integer.');
  }
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < num_chars; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default sendRequestToParent;

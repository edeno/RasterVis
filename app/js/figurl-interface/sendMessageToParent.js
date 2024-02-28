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

const sendMessageToParent = (x, { parentOrigin }) => {
  const parentOrOpenerWindow = queryParams.useOpener === '1' ? window.opener : window.parent;
  // if no parent, this will post to itself
  parentOrOpenerWindow.postMessage(x, parentOrigin);
};

export default sendMessageToParent;

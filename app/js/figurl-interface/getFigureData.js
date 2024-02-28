import sendRequestToParent from './sendRequestToParent';
import deserializeReturnValue from './deserializeReturnValue';

const getFigureData = () => {
  return new Promise((resolve, reject) => {
    const request = {
      type: 'getFigureData',
      figurlProtocolVersion: 'p1'
    };
    sendRequestToParent(request).then(response => {
      resolve(deserializeReturnValue(response.figureData));
    }).catch((err) => {
      reject(err);
    })
  })
};

export default getFigureData;

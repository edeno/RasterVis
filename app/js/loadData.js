import getFigureData from "./figurl-interface/getFigureData";
import startListeningToParent from "./figurl-interface/startListeningToParent";

let figurlObjectLoadState = "not-loaded";

function fetchFigurlObject() {
  return new Promise((resolve, reject) => {
    getFigureData().then((data) => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    });
  });
}

function getFigurlObject(callback) {
  // check if this window is the top-level window
  if (window === window.parent) {
    // this is the top-level window, so it is not being embedded in an iframe
    callback(null, null);
    return
  }

  if (figurlObjectLoadState === "loading") {
    setTimeout(() => {
      getFigurlObject(callback);
    }, 10);
  } else if (figurlObjectLoadState === "loaded") {
    callback(null, window.figurlObject);
  } else if (figurlObjectLoadState === "error") {
    callback("Error loading figurlObject", null);
  } else {
    figurlObjectLoadState = "loading";
    // fetch("figurl_data.json")
    // .then((response) => response.json())
    fetchFigurlObject()
      .then((figurlObject) => {
        window.figurlObject = figurlObject;
        figurlObjectLoadState = "loaded";
        callback(null, figurlObject);
      })
      .catch((error) => {
        figurlObjectLoadState = "error";
        callback(error, null);
      });
  }
}

export function loadTrialInfo(callback) {
  getFigurlObject((err, figurlObject) => {
    if (figurlObject) {
      callback(null, figurlObject.objects["trialInfo"]);
    } else {
      fetch("DATA/" + "trialInfo.json")
        .then((response) => response.json())
        .then((trialInfo) => {
          callback(null, trialInfo);
        })
        .catch((error) => {
          callback(error, null);
        });
    }
  });
}

export function loadSessionTrialData(sessionName, callback) {
  getFigurlObject((err, figurlObject) => {
    if (figurlObject) {
      callback(null, figurlObject.objects[sessionName + "_TrialInfo"]);
    } else {
      fetch("DATA/" + sessionName + "_TrialInfo.json")
        .then((response) => response.json())
        .then((trialData) => {
          callback(null, trialData);
        })
        .catch((error) => {
          callback(error, null);
        });
    }
  });
}

export function loadNeuronData(neuronName, callback) {
  getFigurlObject((err, figurlObject) => {
    if (figurlObject) {
      callback(null, figurlObject.objects["Neuron_" + neuronName]);
    } else {
      fetch("DATA/Neuron_" + neuronName + ".json")
        .then((response) => response.json())
        .then((neuron) => {
          callback(null, neuron);
        })
        .catch((error) => {
          callback(error, null);
        });
    }
  });
}

startListeningToParent();
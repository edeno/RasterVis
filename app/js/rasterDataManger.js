import merge from '../../node_modules/lodash-es/merge';
import queue from '../../node_modules/d3-queue/src/queue';
import loading from './loading';
import {loadTrialInfo, loadSessionTrialData, loadNeuronData} from './loadData';

export default function () {
  let neuronName = '';
  let sessionName = '';
  let brainArea = '';
  let Subject = '';
  let timeDomain = [];
  let factorList = [];
  let trialEvents = [];
  let neuronList = [];
  let includeBrainAreas = [];
  let rasterData = {};
  let spikeInfo = {};
  let sessionInfo = {};
  let showSpikes = true;
  let showSmoothingLines = true;
  let lineSmoothness = 20;
  let curFactor = 'trial_id';
  let curEvent = 'start_time';
  let interactionFactor = '';
  let isLoaded = false;
  let dispatch = d3.dispatch('dataReady');
  let dataManager = {};
  let colorScale = d3.scale.ordinal().domain(['Spike']).range(['black']);

  dataManager.loadRasterData = function () {
    isLoaded = false;
    loadTrialInfo((error, trialInfo) => {
      factorList = trialInfo.experimentalFactor;
      trialEvents = trialInfo.timePeriods;
      neuronList = trialInfo.neurons;
      includeBrainAreas = d3.map(neuronList, function (d) { return d.brainArea; }).keys();

      if (neuronName === '') {
        neuronName = neuronList.length ? neuronList[0].name : neuronList.name;
      };

      loading(isLoaded, neuronName);

      let neuronInfo = neuronList.length ? neuronList.filter(function (d) {
        return d.name === neuronName;
      })[0] : neuronList;

      sessionName = neuronInfo.sessionName;
      Subject = neuronInfo.subjectName;

      queue()
        .defer(loadSessionTrialData, sessionName)
        .defer(loadNeuronData, neuronName)
        .await(function (error, sI, neuron) {
          spikeInfo = neuron.Spikes;
          brainArea = neuron.Brain_Area;
          sessionInfo = sI;
          isLoaded = true;
          loading(isLoaded);

          if (interactionFactor.length > 0) {
            let factorLevels = d3.set(sessionInfo.map(function (s) {
              return s[interactionFactor];
            })).values();

            let interactingFactorType = factorList.filter(function (d) {
              return d.value === interactionFactor;
            })
              .map(function (d) { return d.factorType; })[0].toUpperCase();

            factorLevels = factorLevels
              .filter(function (k) { return k.key !== 'null'; });

            (interactingFactorType === 'CONTINUOUS') ? factorLevels.sort(d3.ascending()) :
              factorLevels.sort();

            colorScale = d3.scale.ordinal()
              .domain(factorLevels)
              .range(['#e41a1c', '#377eb8', '#66a61e', '#984ea3', '#ff7f00']);
          }

          dataManager.sortRasterData();
          dataManager.changeEvent();
          dispatch.dataReady();

        });
    });

  };

  dataManager.changeEvent = function () {
    let minTime = d3.min(sessionInfo, function (s) { return s.start_time - s[curEvent]; });

    let maxTime = d3.max(sessionInfo, function (s) { return s.end_time - s[curEvent]; });

    timeDomain = [minTime, maxTime];
  };

  dataManager.sortRasterData = function () {
    rasterData = merge(sessionInfo, spikeInfo);
    let factorType = factorList.filter(function (d) { return d.value === curFactor; })
      .map(function (d) { return d.factorType; })[0].toUpperCase();

    // Nest and Sort Data
    if (factorType !== 'CONTINUOUS') {
      rasterData = d3.nest()
        .key(function (d) { return d[curFactor] + '_' + sessionName; }) // nests data by selected factor
        .sortKeys(function (a, b) {
          // Sort ordinal keys
          if (factorType === 'ORDINAL') return d3.descending(+a[curFactor], +b[curFactor]);
        })
        .sortValues(function (a, b) {
          // If interaction factor is specified, then sort by that as well
          if (interactionFactor.length > 0) {
            return d3.descending(a[interactionFactor], b[interactionFactor]);
          } else {
            // else sort by trial id
            return d3.descending(+a.trial_id, +b.trial_id);
          };
        })
        .entries(rasterData);
    } else {
      rasterData = d3.nest()
        .key(function (d) { return d[''] + '_' + sessionName; }) // nests data by selected factor
        .sortValues(function (a, b) { // sorts values on factor if continuous
          return d3.descending(+a[curFactor], +b[curFactor]);
        })
        .entries(rasterData);
    }
  };

  dataManager.neuronName = function (value) {
    if (!arguments.length) return neuronName;
    neuronName = value;
    dataManager.loadRasterData();
    return dataManager;
  };

  dataManager.brainArea = function (value) {
    if (!arguments.length) return brainArea;
    brainArea = value;
    return dataManager;
  };

  dataManager.sessionName = function (value) {
    if (!arguments.length) return sessionName;
    sessionName = value;
    return dataManager;
  };

  dataManager.interactionFactor = function (value) {
    if (!arguments.length) return interactionFactor;
    interactionFactor = value;
    return dataManager;
  };

  dataManager.rasterData = function (value) {
    if (!arguments.length) return rasterData;
    rasterData = value;
    return dataManager;
  };

  dataManager.showSpikes = function (value) {
    if (!arguments.length) return showSpikes;
    showSpikes = value;
    if (isLoaded) dispatch.dataReady();
    return dataManager;
  };

  dataManager.showSmoothingLines = function (value) {
    if (!arguments.length) return showSmoothingLines;
    showSmoothingLines = value;
    if (isLoaded) dispatch.dataReady();
    return dataManager;
  };

  dataManager.lineSmoothness = function (value) {
    if (!arguments.length) return lineSmoothness;
    lineSmoothness = value;
    if (isLoaded) dispatch.dataReady();
    return dataManager;
  };

  dataManager.curFactor = function (value) {
    if (!arguments.length) return curFactor;
    curFactor = value;
    if (isLoaded) dataManager.sortRasterData(); dispatch.dataReady();
    return dataManager;
  };

  dataManager.curEvent = function (value) {
    if (!arguments.length) return curEvent;
    curEvent = value;
    if (isLoaded) dataManager.changeEvent(); dispatch.dataReady();
    return dataManager;
  };

  dataManager.timeDomain = function (value) {
    if (!arguments.length) return timeDomain;
    timeDomain = value;
    return dataManager;
  };

  dataManager.factorList = function (value) {
    if (!arguments.length) return factorList;
    factorList = value;
    return dataManager;
  };

  dataManager.trialEvents = function (value) {
    if (!arguments.length) return trialEvents;
    trialEvents = value;
    return dataManager;
  };

  dataManager.neuronList = function (value) {
    if (!arguments.length) return neuronList;
    neuronList = value;
    return dataManager;
  };

  dataManager.colorScale = function (value) {
    if (!arguments.length) return colorScale;
    colorScale = value;
    return dataManager;
  };

  dataManager.includeBrainAreas = function (value) {
    if (!arguments.length) return includeBrainAreas;
    includeBrainAreas = value;
    if (isLoaded) dispatch.dataReady();
    return dataManager;
  };

  d3.rebind(dataManager, dispatch, 'on');

  return dataManager;

}

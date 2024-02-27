import json
from pathlib import Path
import numpy as np
from pynwb import NWBHDF5IO
import remfile
import h5py


def make_trials_json(trials, nwbfile, output_path=""):
    subject = str(nwbfile.subject.subject_id)
    json_data = [
        {"trial_id": trial_id, **trial.to_dict()}
        for trial_id, trial in trials.iterrows()
    ]
    trials_filename = Path(output_path) / Path(f"{subject}_TrialInfo.json")
    json_output = json.dumps(json_data)

    with open(trials_filename, "w") as file:
        file.write(json_output)


def make_neurons_json(trials, units, nwbfile, output_path="", brain_area_column=None):
    n_trials = len(trials)
    subject = str(nwbfile.subject.subject_id)

    for unit_id, unit in units.iterrows():
        unit_spike_times = unit["spike_times"]

        # Need to make optional because brain area not always here.
        # IBL data has other column. Give user option to specify column or check this automatically.
        if brain_area_column is not None:
            brain_area = unit[brain_area_column]
        else:
            try:
                brain_area = str(unit["electrodes"].location.to_numpy()[0])
            except AttributeError:
                brain_area = "unknown"

        spikes_list = [
            {
                "trial_id": trial_id,
                "spikes": unit_spike_times[
                    np.logical_and(
                        unit_spike_times > trial["start_time"],
                        unit_spike_times < trial["stop_time"],
                    )
                ].tolist(),
            }
            for trial_id, trial in trials.iterrows()
        ]
        json_data = {
            "Name": str(unit_id),
            "Brain_Area": brain_area,
            "Subject": subject,
            "Number_of_Trials": n_trials,
            "Spikes": spikes_list,
        }
        neuron_filename = Path(output_path) / Path(f"Neuron_{subject}_{unit_id}.json")
        json_output = json.dumps(json_data)
        with open(neuron_filename, "w") as file:
            file.write(json_output)


def make_trial_info_json(trials, units, nwbfile, output_path="", time_periods=None):
    subject = str(nwbfile.subject.subject_id)
    # time_periods = [
    #     {
    #         "name": name,
    #         "label": label,
    #         "startID": start_id,
    #         "endID": end_id,
    #         "color": color,
    #     }
    # ]
    if time_periods is None:
        time_periods = []

    subject = str(nwbfile.subject.subject_id)
    brain_area_column = None

    session_name = nwbfile.session_id

    neurons = []
    for unit_id, unit in units.iterrows():
        if brain_area_column is not None:
            brain_area = unit[brain_area_column]
        else:
            try:
                brain_area = str(unit["electrodes"].location.to_numpy()[0])
            except AttributeError:
                brain_area = "unknown"
        name = f"{subject}_{unit_id}"
        neurons.append(
            {
                "name": name,
                "sessionName": session_name,
                "brainArea": brain_area,
            }
        )

    other_trial_columns = trials.loc[
        :, trials.columns[~trials.columns.isin(["start_time", "stop_time"])]
    ]
    is_categorical = [
        other_trial_columns[column].nunique() < 10
        for column in other_trial_columns.columns
    ]
    experimental_factor = [
        {"name": "trial_id", "value": "trial_id", "factorType": "continuous"}
    ]
    for column, is_cat in zip(other_trial_columns.columns, is_categorical):
        if is_cat:
            factor_type = "categorical"
        else:
            factor_type = "continuous"
        experimental_factor.append(
            {
                "name": column,
                "value": column,
                "factorType": factor_type,
            }
        )

    trials_filename = Path(output_path) / Path("trialInfo.json")
    json_data = {
        "neurons": neurons,
        "timePeriods": time_periods,
        "experimentalFactor": experimental_factor,
    }
    json_output = json.dumps(json_data)

    with open(trials_filename, "w") as file:
        file.write(json_output)


def run_conversion(nwb_path, output_path="", time_periods=None):
    """Converts an NWB file to the RasterVis format.

    Parameters
    ----------
    nwb_path : str
        The path to the NWB file to be converted.
    output_path : str, optional
        The directory to save the output json file to., by default ""
    time_periods : _type_, optional
        Describes the time periods within trial, by default None
    """
    with NWBHDF5IO(nwb_path, "r", load_namespaces=True) as io:
        nwbfile = io.read()
        units = nwbfile.units.to_dataframe()
        trials = nwbfile.trials.to_dataframe()
        make_neurons_json(trials, units, nwbfile, output_path=output_path)
        make_trials_json(trials, nwbfile, output_path=output_path)
        make_trial_info_json(
            trials, units, nwbfile, output_path=output_path, time_periods=time_periods
        )


def run_conversion_streaming(s3_url, output_path="", time_periods=None):
    """Converts an NWB file stored on S3 to the RasterVis format.

    Parameters
    ----------
    s3_url : str
        The S3 url of the NWB file to be converted.
    output_path : str, optional
        The directory to save the output json file to., by default ""
    time_periods : dict, optional
        Describes the time periods within trial, by default None
    """
    rem_file = remfile.File(s3_url)
    with h5py.File(rem_file, "r") as h5py_file:
        with NWBHDF5IO(file=h5py_file, load_namespaces=True) as io:
            nwbfile = io.read()
            units = nwbfile.units.to_dataframe()
            trials = nwbfile.trials.to_dataframe()
            make_neurons_json(trials, units, nwbfile, output_path=output_path)
            make_trials_json(trials, nwbfile, output_path=output_path)
            make_trial_info_json(
                trials,
                units,
                nwbfile,
                output_path=output_path,
                time_periods=time_periods,
            )


def json_smash(data_path, output_path="", remove_file=False):
    """Converts a directory of json files into a single json file with a specific format.

    Parameters
    ----------
    data_path : str
        The directory containing the json files to be converted.
    output_path : str
        The directory to save the output json file to.
    remove_file : bool, optional
        Whether to remove the original json files after conversion, by default True
    """
    obj = {"objects": {}}
    for json_file in Path(data_path).glob("*.json"):
        with open(json_file, "r") as fin:
            content = json.load(fin)
            obj["objects"][json_file.stem] = content

        if remove_file:
            json_file.unlink()

    output_path = Path(output_path) / Path("figurl_data.json")
    with open(output_path, "w") as fout:
        json.dump(obj, fout)

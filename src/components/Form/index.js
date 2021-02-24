import React, {useRef, useState, useEffect, useCallback} from "react";
import {labelImage, labelImageCustom, listModels, startModel} from '../../API/ImageAPI';
import styles from "./Form.module.css"

const Form = ({imageLabels, setImageLabels, setImage}) => {

    const imageInput = useRef();
    const maxLabelsInput = useRef();
    const minConfidenceInput = useRef();
    const modelToStart = useRef();
    const modelSelected = useRef();
    const [selectedFile, setSelectedFile] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [maxLabels, setMaxLabels] = useState(10);
    const [minConfidence, setMinConfidence] = useState(80);
    const [models, setModels] = useState({toStart: [], running: []});

    const obtainLabels = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const imageFile = imageInput.current.files[0];
        setIsFetching(true);
        const currentModel = modelSelected.current.value;
        let labels = [];
        if (currentModel === '' ) {
          const request = await labelImage(imageFile,
            {MaxLabels: maxLabels, MinConfidence: minConfidence}
          );
          labels = request.data
        } else {
          const tempCustomLabels = await labelImageCustom(
            imageFile,
            {MaxLabels: maxLabels, MinConfidence: minConfidence, ProjectVersionArn: currentModel},
          );
          labels = tempCustomLabels.data.map((label) => {
              return {
                Instances: [
                  {BoundingBox: label.Geometry.BoundingBox},
                ],
                Name: label.Name,
                Confidence: label.Confidence,
              }
            });
        }
        setIsFetching(false);
        setImageLabels(labels);
        setImage(imageFile);
    }

    const updateNameFile = () => {
        setSelectedFile(imageInput.current.files[0].name);
    }

    const changeMaxLabels = () => {
        setMaxLabels(maxLabelsInput.current.value);
    }

    const changeMinConfidence = () => {
        setMinConfidence(minConfidenceInput.current.value);
    }

    const retrieveModels = useCallback(async () => {
      const modelsResponse = await listModels();
      console.log(modelsResponse.data)
      const allModels = modelsResponse.data.ProjectVersionDescriptions.map((model) => {
        return {
          ProjectVersionArn: model.ProjectVersionArn,
          name: model.ProjectVersionArn.match(/\/version\/(\w*)\//)[1],
          status: model.Status,
        }
      });

      const toStart = allModels.filter(
        (model) => (model.status !== 'STARTING' && model.status !== 'RUNNING')
      );

      const running = allModels.filter(
        (model) => (model.status === 'RUNNING')
      )

      setModels({toStart, running});
    }, [])

    useEffect(() => {

      const interval = setInterval(retrieveModels, 30000);
      retrieveModels();

      return () => clearInterval(interval);
    }, [retrieveModels])

    const startCurrentModel = async () => {
      const projectArn = modelToStart.current.value;

      if(projectArn !== '') {
        const status = await startModel({projectArn})

        if (status === 'STARTING') {
          setModels({
            running: models.running,
            toStart: models.toStart.filter(
              (model) => (model.ProjectVersionArn !== projectArn)
            )
            }
          )
        }

      }
    }

    return (
        <div className={styles.form}>
            <label htmlFor="available-models" className={styles.labelStartModel}>Select Model to start</label>
            <select name="available-models" ref={modelToStart}>
              { models.toStart.length > 0 ? null: <option value="">All Models running</option>}
              { models.toStart.map((model, index) => (
                  <option key={index} value={model.ProjectVersionArn} disabled={model.status === 'TRAINING_IN_PROGRESS'}>{model.name}</option>
                )
                )}
            </select>
            <button onClick={startCurrentModel} className={styles.submitButton} disabled={models.toStart.length === 0 }>
              Start selected Model
            </button>
            <hr className={styles.separator}/>
            <label htmlFor="model" className={styles.labelSelectModel}>Choose running Model:</label>
            <select name="model" ref={modelSelected}>
              <option value="">Default</option>
              { models.running.map((model, index) => (
                <option key={index} value={model.ProjectVersionArn}>{model.name}</option>
              ))}
            </select>
            <label htmlFor="imageToUpload" className={styles.fileUpload}>
                <input ref={imageInput}
                       type="file"
                       name="imageToUpload"
                       id="imageToUpload"
                       accept="image/*"
                       className={styles.inputFile}
                       onChange={updateNameFile}
                />
                <span className={styles.fileLabel}>
                    {selectedFile === ''
                        ? 'Select Image to Label'
                        : selectedFile
                    }
                </span>
            </label>

            <label htmlFor="maxLabels" className={styles.sliderLabel}>
                <span>Max Number of Labels: {maxLabels}</span>
                <input
                    ref={maxLabelsInput}
                    name="maxLabels"
                    type="range"
                    min="1"
                    max="20"
                    defaultValue="10"
                    className={styles.slider}
                    onChange={changeMaxLabels}
                />
            </label>

            <label htmlFor="minConfidence" className={styles.sliderLabel}>
                <span>Min Confidence: {minConfidence}</span>
                <input
                    ref={minConfidenceInput}
                    name="minConfidence"
                    type="range"
                    min="1"
                    max="100"
                    defaultValue="80"
                    className={styles.slider}
                    onChange={changeMinConfidence}
                />
            </label>

            <button onClick={obtainLabels} className={styles.submitButton}>
                {isFetching ? '...Loading' : 'Submit Image'}
            </button>

            <div className={styles.labelsContainer}>
                {imageLabels !== undefined ?
                    imageLabels.map((label, index) => (
                        <div className={styles.labels} key={`${label.Name} ${index}`}>
                            {`${label.Name}: ${label.Confidence.toFixed(2)}%`}
                        </div>
                    )) :
                    ''
                }
            </div>
        </div>
    )
}

export default Form;
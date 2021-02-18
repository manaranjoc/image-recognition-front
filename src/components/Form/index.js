import React, {useRef, useState} from "react";
import {labelImage} from "../../API/ImageAPI";
import styles from "./Form.module.css"

const Form = ({imageLabels, setImageLabels, setImage}) => {

    const imageInput = useRef();
    const maxLabelsInput = useRef();
    const minConfidenceInput = useRef();
    const [selectedFile, setSelectedFile] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [maxLabels, setMaxLabels] = useState(10);
    const [minConfidence, setMinConfidence] = useState(80);

    const obtainLabels = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const imageFile = imageInput.current.files[0];
        setIsFetching(true);
        const labels = await labelImage(imageFile,
            {MaxLabels: maxLabels, MinConfidence: minConfidence}
            );
        setIsFetching(false);
        setImageLabels(labels.data);
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


    return (
        <div action="" className={styles.form}>
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
                    imageLabels.map((label) => (
                        <div className={styles.labels} key={label.Name}>
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
import React, {useRef, useState} from "react";
import {labelImage} from "../../API/ImageAPI";
import styles from "./Form.module.css"

const Form = ({setImageLabels, setImage}) => {

    const imageInput = useRef();
    const [selectedFile, setSelectedFile] = useState('');

    const obtainLabels = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const imageFile = imageInput.current.files[0];
        const labels = await labelImage(imageFile);
        setImageLabels(labels.data);
        setImage(imageFile);
    }

    const updateNameFile = () => {
        setSelectedFile(imageInput.current.files[0].name);
    }


    return (
        <form action="" className={styles.form}>
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

            <button onClick={obtainLabels} className={styles.submitButton}>Submit Image</button>
        </form>
    )
}

export default Form;
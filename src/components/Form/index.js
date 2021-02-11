import React, {useRef} from "react";
import {labelImage} from "../../API/ImageAPI";

const Form = ({setImageLabels, setImage}) => {

    const imageInput = useRef();

    const obtainLabels = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const imageFile = imageInput.current.files[0];
        const labels = await labelImage(imageFile);
        setImageLabels(labels.data);
        setImage(imageFile);
    }


    return (
        <form action="">
            <label htmlFor="imageToUpload">Select Image to Label</label>
            <input ref={imageInput} type="file" name="imageToUpload" id="imageToUpload" accept="image/*"/>
            <button onClick={obtainLabels}>Submit Image</button>
        </form>
    )
}

export default Form;
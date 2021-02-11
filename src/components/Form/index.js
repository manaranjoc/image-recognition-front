import React, {useRef, useState} from "react";
import {labelImage} from "../../API/ImageAPI";

const Form = () => {

    const imageInput = useRef();
    const [imageLabels, setImageLabels] = useState([]);

    const obtainLabels = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const imageFile = imageInput.current.files[0];
        const labels = await labelImage(imageFile);

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
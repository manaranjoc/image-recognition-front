import axios from "axios";

const {REACT_APP_IMAGE_SERVICE: BASE_URL} = process.env;

const labelImage = (image, parameters) => {
    const formData = new FormData();
    formData.append('image', image);
    Object.keys(parameters).forEach((key) =>
        formData.append(key, parameters[key])
    )
    return axios.post(`${BASE_URL}images`, formData);
}

const uploadImage = (image) => {
    const formData = new FormData();
    formData.append('image', image);
    return axios.post(`${BASE_URL}images/upload-image`);
}

export {labelImage, uploadImage}
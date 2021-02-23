import axios from "axios";

const {REACT_APP_IMAGE_SERVICE: BASE_URL} = process.env;

const labelImage = (image, parameters) => {
    console.log(image);
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
    return axios.post(`${BASE_URL}images/upload-image`, formData);
}

const uploadManifest = (manifest) => {
    return axios.post(`${BASE_URL}images/upload-manifest`, manifest);
}

const listModels = () => {
    return axios.get(`${BASE_URL}images/models`);
}

const startModel = (modelToStart) => {
    return axios.post(`${BASE_URL}images/start-model/`, modelToStart);
}

const labelImageCustom = (image, parameters) => {
    const formData = new FormData();
    formData.append('image', image);
    Object.keys(parameters).forEach((key) =>
      formData.append(key, parameters[key])
    )
    return axios.post(`${BASE_URL}images/custom`, formData);
}

export {labelImage, uploadImage, uploadManifest, listModels, startModel, labelImageCustom}
import axios from "axios";

const {REACT_APP_IMAGE_SERVICE: BASE_URL} = process.env;

const labelImage = (image, parameters) => {
    const formData = new FormData();
    formData.append('image', image);
    return axios.post(`${BASE_URL}images`, formData);
}

export {labelImage}
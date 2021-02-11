import axios from "axios";

const {REACT_APP_IMAGE_SERVICE: BASE_URL} = process.env;

const labelImage = (Image) => {
    return axios.get(`${BASE_URL}images`);
}

export {labelImage}
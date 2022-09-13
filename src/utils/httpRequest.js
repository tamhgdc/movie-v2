import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://ophim1.com/',
});

export default httpRequest;

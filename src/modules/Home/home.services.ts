import axios from "axios";

class HomeService {
    
    constructor(private api = axios.create({
        baseURL: 'http://localhost:5500/'
    })) {

    }


    async submitProject() {}
    async submitFile() {}
    async submitContent() {}
    async retrieveContent() {}
    
}
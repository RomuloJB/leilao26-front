import BaseService from './baseService';

class ImagemService extends BaseService {
    constructor() {
        super('/imagem');
    }

    upload(dadosFormData) {
        return this.post('/upload', dadosFormData);
    }
}

const imagemService = new ImagemService();
export default imagemService;

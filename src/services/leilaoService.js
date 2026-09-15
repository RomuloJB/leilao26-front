import BaseService from './baseService';

class LeilaoService extends BaseService {
    constructor() {
        super('/leilao');
    }

    buscarPorId(id) {
        return this.get(`/buscar/id/${id}`);
    }
}

const leilaoService = new LeilaoService();
export default leilaoService;

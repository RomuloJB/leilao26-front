import BaseService from './baseService';

class LanceService extends BaseService {
    constructor() {
        super('/lance');
    }

    registrar(leilaoId, valorLance) {
        return this.post('/registrar', { leilaoId, valorLance });
    }

    buscarPorLeilao(leilaoId) {
        return this.get(`/buscar/leilao/${leilaoId}`);
    }
}

const lanceService = new LanceService();
export default lanceService;

import BaseService from './baseService';

class LeilaoService extends BaseService {
    constructor() {
        super('/leilao');
    }
}

const leilaoService = new LeilaoService();
export default leilaoService;

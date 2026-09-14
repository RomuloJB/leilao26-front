import BaseService from './baseService';

class PagamentoService extends BaseService {
    constructor() {
        super('/pagamento');
    }
}

const pagamentoService = new PagamentoService();
export default pagamentoService;

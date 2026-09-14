import BaseService from './baseService';

class PessoaService extends BaseService {
    constructor() {
        super('/pessoa');
    }
}

const pessoaService = new PessoaService();
export default pessoaService;

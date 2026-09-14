import BaseService from './baseService';

class CategoriaService extends BaseService {
    constructor() {
        super('/categoria');
    }

    buscarPorId(id) {
        return this.get(`/buscar/id/${id}`);
    }
}

const categoriaService = new CategoriaService();
export default categoriaService;

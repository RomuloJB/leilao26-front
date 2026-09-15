import Api from '../api/axiosInstance';

export default class BaseService {
    constructor(recurso) {
        this.recurso = recurso;
    }

    get(caminho = '') {
        return Api.get(`${this.recurso}${caminho}`);
    }

    post(caminho, dados, config) {
        return Api.post(`${this.recurso}${caminho}`, dados, config);
    }

    put(caminho, dados, config) {
        return Api.put(`${this.recurso}${caminho}`, dados, config);
    }

    delete(caminho = '') {
        return Api.delete(`${this.recurso}${caminho}`);
    }

    listar() {
        return this.get('');
    }

    buscarTodos() {
        return this.get('/buscar');
    }

    buscarPorId(id) {
        return this.get(`/buscar/id/${id}`);
    }

    criar(dados, config) {
        return this.post('/registrar', dados, config);
    }

    atualizar(id, dados, config) {
        return this.put(`/atualizar/${id}`, dados, config);
    }

    excluir(id) {
        return this.delete(`/excluir/${id}`);
    }
}

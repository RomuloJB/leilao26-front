import BaseService from './baseService';

class LanceService extends BaseService {
    constructor() {
        super('/lance');
    }
}

const lanceService = new LanceService();
export default lanceService;

import BaseService from './baseService';

class FeedbackService extends BaseService {
    constructor() {
        super('/feedback');
    }
}

const feedbackService = new FeedbackService();
export default feedbackService;

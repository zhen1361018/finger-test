import http from '../http';

export default {
    login(data: any) {
        return http({
            url: '/ad/login',
            method: 'POST',
            data
        });
    },
    token() {
        return http({
            url: '/token',
            method: 'get'
        });
    }
};

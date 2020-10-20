import http from '../http';
export default {
    getAllFinger(data: any) {
        return http({
            url: '/user/list',
            method: 'POST',
            data
        });
    },
    addFinger(data: any) {
        return http({
            url: '/finger/create',
            method: 'POST',
            data
        });
    },
    deleteUser(data: any) {
        return http({
            url: '/user',
            method: 'DELETE',
            params: data
        });
    },
    deleteFinger(data: any) {
        return http({
            url: '/finger',
            method: 'DELETE',
            params: data
        });
    }
};

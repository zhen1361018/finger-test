export default {
    state: {
        token: '',
        name: '',
        mail: '',
        displayName: '',
        company: '',
        department: '',
        email: '',
        userid: '',
        roles: [],
        auth: 3
    },
    mutations: {
        setUser(state: any, user: any) {
            state.token = user.token;
            state.name = user.name;
            state.mail = user.mail;
            state.displayName = user.displayName;
            state.company = user.company;
            state.department = user.department;
            state.email = user.email;
            state.userid = user.userid;
            state.roles = user.roles;
            if (state.roles && state.roles.length > 0) {
                console.log(state.roles[0].roleId);
                if (state.roles[0].roleId === '1') {
                    state.auth = 1;
                }
                if (state.roles[0].roleId === '2') {
                    state.auth = 2;
                }
                if (state.roles[0].roleId === '3') {
                    state.auth = 3;
                }
            }
        }
    },
    actions: {}
};

module.exports = {

    jade: {

    },
    pub: {
    },
    common: {
    },
    options: {

    },
    routes: {
        'GET /code': 'Test#code',
        'GET /': 'Test#index',
        'POST /user/:openid': 'Test#saveUser',
        'GET /user/:openid': 'Test#getOpenId',
        'GET /long_polling': 'Poll#index',
        'GET /notify': 'Poll#notify'
    },
    controllers: {
        Poll: {

        },
        Test: {
            services: {
                TestService: 'TestService',
            }
        }
    },
    services: {
        'TestService': {
            'clz': './services/TestService',
            'options': {
                key: 'value'
            }

        }
    }
};

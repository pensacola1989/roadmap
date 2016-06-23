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
        'GET /:openid': 'Test#index',
        'POST /user/:openid': 'Test#saveUser',
        'GET /user/:openid': 'Test#getOpenId',
        'GET /long_polling': 'Poll#index',
        'GET /code': 'Test#code',
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

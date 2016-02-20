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
        'GET /': 'Test#action',
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

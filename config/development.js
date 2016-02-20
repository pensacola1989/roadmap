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
        'GET /': 'Test#action'
    },
    controllers: {
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

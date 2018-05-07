module.exports = {
    entry  : './js/pomodoro.js',
    output : {
        path     : __dirname,
        filename : 'js/pomodoro.dist.js'
    },
    module : {
        rules: [ { 
                test   : /.js$/,
                loader : 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [
                        'es2015',
                        'stage-2'
                    ]
                }
            }
        ]
    }
};
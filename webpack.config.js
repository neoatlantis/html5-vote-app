const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env)=>{

    const is_dev = (env.production === undefined);
    const output_path = path.resolve(__dirname);


    return [
        {
            entry: './app/index.js',
            mode: is_dev?'development':'production',
            watch: is_dev,
            output: {
                filename: 'app.js',
                path: output_path,
            },
            resolve: {
                alias: {
                    app: path.resolve(__dirname, "app"),
                    sfc: path.resolve(__dirname, "app", "vue"),
                },
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },
                    {
                    },
                    {
                        test: /\.(vue|js)$/,
                        loader: 'ifdef-loader',
                        exclude: /node_modules/,
                        options: {
                            DEV: is_dev,
                        }
                    }
                ]
            },
            plugins: [
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin({
                    template: "./app/index.html",
                }),
            ]
        },
    ];

}; 

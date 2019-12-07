const { env } = process;
console.log(env.NODE_ENV);

const config = {
  env: env.NODE_ENV || 'development'
};

const devConfig = {
  db: 'mongodb://localhost:27017/live-coding-ds',
  jwt_key: 'babylon'
};

const prodConfig = {
  db:
    'mongodb+srv://Antje:xmjWaMgmc8HgSIq1@record-store-kibi0.mongodb.net/test?retryWrites=true&w=majority',
  jwt_key: 'babylon'
};

const currentConfig = config.env === 'production' ? prodConfig : devConfig;
module.exports = Object.assign({}, config, currentConfig);
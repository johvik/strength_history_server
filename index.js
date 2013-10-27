exports = process.env.STRENGTH_HISTORY_COV
  ? require('./lib-cov/app')
  : require('./lib/app');

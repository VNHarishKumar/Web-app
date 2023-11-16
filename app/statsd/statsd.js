import StatsD from 'node-statsd';

const client = new StatsD({
  host: '127.0.0.1', // Replace with your StatsD server address
  port: 8125,        // Replace with your StatsD server port
});

export const getStatsd = () => {
  return (req, res, next) => {
    const metricName = `api.${req.method.toLowerCase()}.${req.originalUrl}`;
    client.increment(metricName);
    next();
  };
};

export const endStatsd = () => {
    return(req,res,next) =>{
        client.close();
        next();
    }
}
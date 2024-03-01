import assign1 from './assign1-routes.js';
import * as assign2 from '../controllers/assign1-controller.js';
import assign3 from './assign3-routes.js';
import { getStatsd,endStatsd } from '../statsd/statsd.js';
// import assign5 from './assign4-routes.js';
import * as auth from './../authenticate/authenticate.js';


const route = (app) => {
   
    app.use(getStatsd());
    app.get('/', (req, res) => {
        res.status(200).send(); // Send a 200 OK response
    });
    app.use('/healthz',assign1);
    app.use('/v1/assignments',assign3);
    
    app.use('*',assign2.checkOtherMethod);

}

export default route;


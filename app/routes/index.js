import assign1 from './assign1-routes.js';
import * as assign2 from '../controllers/assign1-controller.js';
import assign3 from './assign3-routes.js';
import { getStatsd,endStatsd } from '../statsd/statsd.js';
// import assign5 from './assign4-routes.js';
import * as auth from './../authenticate/authenticate.js';


const route = (app) => {
    // public route
    // const statsmw = getStatsd();
    // app.use(statsmw);
    app.use(getStatsd());

    // app.all('/', (req, res) => {
    //     res.redirect('/v1/assignments');
    // });


    // app.get('/', (req, res) => {
    //     res.redirect('/v1/assignments');
    // });
    
    app.get('/', (req, res) => {
        res.status(200).send(); // Send a 200 OK response
    });
    app.use('/healthz',assign1);
    
    // app.use('/',assign1);
    app.use('/v1/assignments',assign3);
    // app.use('/v1/assignments', (req, res, next) => {
    //     // Set the "WWW-Authenticate" header for Basic Authentication
    //     res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
    //     auth.authorization(req,res);
    // });
    
    
    app.use('*',assign2.checkOtherMethod);
   
    // app.use(endStatsd());

}

export default route;


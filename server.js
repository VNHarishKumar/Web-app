import app from './app/app.js';
import databaseCheck from './app/dbloader/dbloader.js';
import tableAdd from './app/util/assign_user_parse.js';


const port = 9000;
await databaseCheck();
await tableAdd();

app.listen(9000,() => console.log(`Server listening at ${port}`) );
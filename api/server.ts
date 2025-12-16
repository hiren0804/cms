import  dotenv from 'dotenv';
import app from './src/app.ts';

dotenv.config();
app.listen(3000,()=>{
    console.log("http://localhost:3000")
})
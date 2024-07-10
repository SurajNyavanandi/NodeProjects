const express=require('express');
const bodyParser=require('body-parser');
const sequelize=require('./config/database');
const userRoutes=require('./routes/userRoutes');
const app=express();


app.use(express.static('views'));
app.use(bodyParser.json());
app.use('/library',userRoutes);


// sequelize.sync({ force: true })
sequelize.sync()
         .then(()=>{
            console.log("Connected to database");
            app.listen(7007);
         })
         .catch((err)=>console.log("Error connecting to database"));
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
dotenv.config();

const app = express();
app.use(cors({
    origin: "https://aadhaar-pan-frontend.vercel.app",
    methods:["GET","POST"],
    credentials: true
}));
app.use(express.json());

app.listen(8080,()=>{
    console.log("Listening from Backend");
});
const connection = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE,
    password: process.env.MYSQLPASSWORD,
    port:process.env.MYSQLPORT,
});
connection.connect((err)=>{
    if(err){
        console.error("data base connection failed: ",err);
    }else{
        console.log("connected dataBase successfully!");
    }
})

app.post("/api/save-data",async(req,res)=>{
    try{
        const UserData = req.body.data;
        console.log("user-data:",UserData);
        if(!UserData || (UserData.PanNo || "").length!==10){
            return res.status(400).json({error: "Invalid Pan Number"});
        }
        const query = `INSERT INTO user_data (aadhaar_number,pan_number,pan_name,dob)
        VALUES(?,?,?,?)`;
        let Data = [UserData.AadhaarNo,UserData.PanNo,UserData.AadhaarName,UserData.DOB];
        connection.query(query,Data,(err,result)=>{
            if(err) throw err;
            console.log(result);
        })
        res.send("RECEIVED PAN DATA SUCCESSFULLY!");
    }catch(err){
        console.error(err.response);
        res.status(500).json({error: err.response?.data || err.message});
    }
});
        

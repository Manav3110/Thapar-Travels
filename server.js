const express=require("express");
const mysql=require("mysql");
const path=require("path");
const bodyParser=require("body-parser");
var nodemailer=require("nodemailer");

const app=express();

var dbConfig={
    host:"localhost",
    user:"root",
    password:"",
    database:"thapartravels"
}

var dbcon=mysql.createConnection(dbConfig);

dbcon.connect(function(err){
    if(err)
        console.log(err.message);
    else
        console.log("Connection  successful");
})

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
var fileup=require("express-fileupload");
app.use(fileup());

app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/pages/index.html");
})

app.get("/profile",function(req,res){
    res.sendFile(__dirname+"/public/pages/userSetting.html");
})

app.get("/uploadTrip",function(req,res){
    res.sendFile(__dirname+"/public/pages/trip.html");
})

app.get("/result",function(req,res){
    res.sendFile(__dirname+"/public/pages/result.html");
})

app.get("/tripDetail",(re,res)=>{
    res.sendFile(__dirname+"/public/pages/tripDetail.html");
})

app.get("/admin",(req,res)=>{
    res.sendFile(__dirname+"/public/pages/adminPanel.html");
})

app.get("/deleteTrip",(req,res)=>{
    res.sendFile(__dirname+"/public/pages/deleteTrip.html");
})

app.listen(5000,function(){
    console.log("hello");
})



app.get("/chk-email-in-table",(req,res)=>{
    dbcon.query("select * from users where email=?",[req.query.thisEmail],(err,result)=>{
        if(err)
            res.send(err.message);
        else{
            console.log(result);
            res.send(result);
        }
    })
})

app.get("/chk-email-in-admin-table",(req,res)=>{
    dbcon.query("select * from admin where email=?",[req.query.thisEmail],(err,result)=>{
        if(err)
            res.send(err.message);
        else{
            console.log(result);
            res.send(result);
        }
    })
})

app.get("/show-allusers",(req,res)=>{
    dbcon.query("select * from users",(err,result)=>{
        if(err)res.send(err.message);

        else{
            console.log(result);
            res.send(result);
        }
    })
})

app.get("/show-user",(req,res)=>{
    dbcon.query("select * from users where Email=?",[req.query.thisEmail],(err,result)=>{
        if(err) res.send(err.message);

        else{
            console.log(result);
            res.send(result);
        }
    })
})

app.post('/signUp',(req,res)=>{
    var data=[req.body.email,req.body.username,req.body.contact,req.body.pwd,req.body.rollno];
    // var mailoptions={
    //     from:'nsingh2_be20@thapar.edu',
    //     to:req.body.email,
    //     subject:'testing',
    //     text:`Thanks for joining our site`
    // };
    dbcon.query("insert into users values(?,?,?,?,?)",data,(err)=>{
        if(err)
            console.log(err.message);
        else{
            res.send("record saved");
            // transporter.sendMail(mailoptions,(err,info)=>{
            //     if(err){
            //         console.log(err)
            //     }
            //     else{
            //         console.log(info.response);
            //     }
            // })
        }
    })
})

app.get("/delUser",(req,res)=>{
    console.log("delete function");

    dbcon.query("delete from trips where email=?",[req.query.thisEmail],(err,result)=>{
        if(err) console.log(err.message);
    })

    dbcon.query("delete from users where Email=?",[req.query.thisEmail],(err,result)=>{
        if(err) console.log(err.message);

        else{
            console.log(result);
        }
    });

    dbcon.query("select * from users where Email=?",[req.query.thisEmail],(err,result)=>{
        if(err) console.log(err.message);
        else{
            console.log(result);
            res.send(result);
        }
    });
})


app.post("/tripUpload",(req,res)=>{
    var pic=req.files.profPic.name;
    if(req.files==null)
    {
        console.log("npp")
    }
    else
    {
        console.log(req.files.profPic.name);
        var uploadsFolder=path.join(path.resolve(),"public","uploads",req.files.profPic.name);     
        req.files.profPic.mv(uploadsFolder);
    }

    var data = [req.body.tripid,req.body.email,req.body.username,req.body.number,req.body.location,req.body.distance,req.body.days,req.body.budget,req.body.discription,pic];
    console.log(data);
    dbcon.query("insert into trips values(?,?,?,?,?,?,?,?,?,?)",data,(err,result)=>{
        if(err) console.log(err.message);

        else{
            console.log(data);
            res.send("trip uploaded");
        }
    })
})

app.get("/get-user-trips",(req,res)=>{
    dbcon.query("select * from trips where email=?",[req.query.thisEmail],(err,result)=>{
        if(err) console.log(err.message)
        else{
            res.send(result)
        }
    })
})


app.get("/show-user-trip-budget",(req,res)=>{
    dbcon.query("select * from trips where email=? and budget<=?",[req.query.thisEmail,req.query.thisBudget],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})

app.get("/show-user-trip-loc",(req,res)=>{
    dbcon.query("select * from trips where email=? and lower(location)=lower(?)",[req.query.thisEmail,req.query.thisLoc],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})

app.get("/show-user-trip-id",(req,res)=>{
    dbcon.query("select * from trips where email=? and tripid=?",[req.query.thisEmail,req.query.thisId],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})


app.get("/del-user-trip-loc",(req,res)=>{
    dbcon.query("delete from trips where email=? and lower(location)=lower(?)",[req.query.thisEmail,req.query.thisLoc],(err,result)=>{
        if(err) console.log(err.message);

        else{
        }
    })

    dbcon.query("select * from trips where email=? and lower(location)=(?)",[req.query.thisEmail,req.query.thisLoc],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})


app.get("/del-user-trip-id",(req,res)=>{
    dbcon.query("delete from trips where email=? and tripid=?",[req.query.thisEmail,req.query.thisId],(err,result)=>{
        if(err) console.log(err.message);

        else{
        }
    })

    dbcon.query("select * from trips where email=? and tripid=?",[req.query.thisEmail,req.query.thisId],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})

app.get("/del-user-trip-budget",(req,res)=>{
    dbcon.query("delete from trips where email=? and budget=?",[req.query.thisEmail,req.query.thisBudget],(err,result)=>{
        if(err) console.log(err.message);

        else{
        }
    })

    dbcon.query("select * from trips where email=? and budget=?",[req.query.thisEmail,req.query.thisBudget],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})


app.get("/show-trip-budget",(req,res)=>{
    dbcon.query("select * from trips where budget<=? order by budget",[req.query.thisBudget],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})

app.get("/show-trip-loc",(req,res)=>{
    dbcon.query("select * from trips where lower(location)=lower(?) order by budget",[req.query.thisLoc],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})

app.get("/show-trip-id",(req,res)=>{
    dbcon.query("select * from trips where tripid=? order by budget",[req.query.thisId],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})

app.post("/change-pass",(req,res)=>{
    dbcon.query("update users set password=? where email=?",[req.body.pass,req.body.email],(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send("password updated");
        }
    })
})

app.get("/show-all-trips",(req,res)=>{
    dbcon.query("select * from trips order by budget",(err,result)=>{
        if(err) console.log(err.message);

        else{
            res.send(result);
        }
    })
})
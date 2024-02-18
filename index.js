const express = require('express')
const { connection } = require('./config/db')
// const bcrypt = require('bcrypt');
const {SignUpModels}=require('./Models/SignupModels')
var jwt = require('jsonwebtoken');
const { UserModel } = require('./Models/UserModel');
const { Auth } = require('./Authentication/Auth');
var cors=require('cors');
const { TicketModels } = require('./Models/TicketModels');
require('dotenv').config()

const app= express()

app.use(cors({
    origin : "*"
  }))
  

app.use(express.json())


app.get("/home",async(req,res)=>{
  res.send("welcome")
})

app.post("/signup", async(req, res) => {
    const {name,email,password} = req.body;
    // const hash = bcrypt.hashSync(password, 5);
    try {
        const signuser=new SignUpModels({
            name: name,
            email: email,
            password:password
        })
        await signuser.save()
        res.status(200).json({msg:"Successfully signed"})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error signing"})
    }
})


app.post("/login",async(req, res) => {

    const { email, password}=req.body
       const user=await SignUpModels.findOne({email:email})
       const userPassword=user.password
      console.log(userPassword,password)
       if(!user){
        res.status(404).json({msg:"Sign Up First"})
       }else{
        // console.log(user._id)
        if(userPassword===password){
          var token = jwt.sign({ user_id:user._id }, 'Dibakar');
          res.status(200).json({msg:"Signup Successfully",token:token})
       
          
        }
      
       }
})

app.get("/",  async (req, res) => {
  const { category, sortby, order, page, limit } = req.query;
  const author_id = req.user_id;
  const pageNo = parseInt(page);
  const limitPerPage = parseInt(limit);
  const skip = (pageNo - 1) * limitPerPage;

  try {
    let filter = { user_id: author_id }; // Filter by the currently logged-in user's ID

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    let query = UserModel.find(filter);

    if (sortby && order) {
      let ordering = order === "asc" ? 1 : -1;
      let sortObj = {};
      sortObj[sortby] = ordering;
      query = query.sort(sortObj);
    }

    if (limitPerPage) {
      query = query.skip(skip).limit(limitPerPage);
    }

    const users = await query.exec();
    const total = await UserModel.countDocuments(filter);

    // Send the response with pagination information
    res.status(200).json({ users, total, page: pageNo });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});


app.get("/bookingdetails/:id", Auth, async (req, res) => {
  
  const id=req.params.id
   

    const user_id=req.user_id
    const signUser=await SignUpModels.findOne({_id:user_id})
    const signUser_email=signUser.email

    const user=await UserModel.findOne({_id:id})
    const user_email=user.email
     console.log(user_email,signUser_email)

    if(signUser_email!=user_email){
        res.status(404).json({msg: 'Invalid email address'})
    }else{
        const data=await UserModel.findById(id)
        res.status(200).json({data}) 
    }

  
});




app.post("/seats",async(req, res) => {
  const { Title,
  Year,
  imdbID,
  Type,
  Poster,
  Seats}=req.body

 
  const blog=new TicketModels({
    
      Title:Title,
      Year:Year,
      imdbID:imdbID,
      Poster:Poster,
    Seats:Seats
    })
  await blog.save()
  res.status(200).json({msg:"Successfully created"})
})




app.listen(8000,async()=>{
    await connection
    try {
        console.log("connection established")
    } catch (error) {
        console.log(error)
    }
})


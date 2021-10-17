const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const nodemailer = require('nodemailer');

const Product = require('../models/Products')
const Truck = require('../models/Trucks')
const Client = require('../models/Clients')
const Order = require('../models/Orders')
const User = require('../models/Users')
const Employee = require('../models/Employees')
//Index Route
router.get('/', (req,res) => {
    res.send({"msg":"Welcome!"});
});

//Login
router.post('/login', async (req, res) => {
    const checkEmail = await User.findOne({email: req.body.email});
    if(!checkEmail) return res.status(400).send("Incorrect Email or Password");
    const checkPass = await bcrypt.compare(req.body.password, checkEmail.password);
    if(!checkPass) return res.status(400).send("Incorrect Email or Password");
   
    const token = jwt.sign({_id: checkEmail._id}, process.env.TOKEN_SECRET)
    res.header('token', token).send({
       token: token,
       id: checkEmail._id,
       firstname: checkEmail.firstname,
       verified: checkEmail.isVerified
    });
   
});

//Register 
router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt)
    const checkEmail = await User.findOne({email: req.body.email});
    if(checkEmail) return res.status(400).send("Email already exists");
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPass,
        isVerified: false,
        email_token: crypto.randomBytes(64).toString('hex'),
        expiresAt: Date.now(),
        date_created: Date.now()
    });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_GMAIL,
            pass: process.env.ADMIN_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    const mailOptions = {
        from: process.env.ADMIN_GMAIL,
        to: req.body.email,
        subject: `Account Confirmation`,
        text: `
            To confirm this account, please copy and paste the url.
            http://${req.headers.host}/verify/${user.email_token}
        `
    }
    try{
        await transporter.sendMail(mailOptions, (err, inf) => {
            if (err) {
                console.log(err);
            } 
            else {
                console.log('Email sent: ' + inf.response);
            }
        })
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/verify', async (req,res) => {
    try{
        const emailToken = await User.findOne({email_token: req.body.email_token})
        console.log(emailToken)
        if(!emailToken){
            res.status(404).send({"msg":"token not found."})
            console.log("not found")
            return
        }

        if(emailToken){
            await User.updateOne({email_token: req.body.email_token}, {isVerified: true})
            console.log("found")
            res.send({"msg":"User verified"})
        }
            
    }
    catch(err){
        res.send(err)
    }
})

//Add a product
router.post('/products/add', async (req, res) => {
    const checkProduct = await Product.findOne({product_name:req.body.product_name})
    if(checkProduct)
        res.status(400).send({"msg":"product exists"})
    if(!checkProduct){
        const newProduct = new Product({
            product_name: req.body.product_name,
            product_desc: req.body.product_desc,
            product_price: req.body.product_price,
            date_created: Date.now()
        })
        try{
            await newProduct.save()
            res.status(200).send({"msg": `Product saved: ${newProduct}`})
        }
        catch(err){
            res.status(400).send({"msg": err});
        }
    }
    

});

//Update a product
router.post('/products/update', async (req, res) => {
    try{
        await Product.updateOne({_id: req.body.id}, {product_name: req.body.product_name, product_desc: req.body.product_desc, product_price: req.body.product_price})
        res.send("ok")
        console.log("updated")
    }
    catch(err){
        res.send(err)
    }
});

//Delete a product
router.post('/products/delete', async (req, res) => {

      const product = {
        _id: req.body.id
    }
  try{
        const deleteProduct = await Product.deleteOne(product)
        if(deleteProudct.deletedCount === 1){
            res.status(200).send({"msg": `Product deleted: ${deleteProduct}`})
        }
    }
    catch(err){
        res.send({"msg": err})
    }
});

//Add a truck
router.post('/trucks/add', async (req, res) => {
    const checkTruck  = await Truck.findOne({truck_code: req.body.truck_code})
    if(checkTruck)
        res.status(400).send({"msg":"truck exists"})
    if(!checkTruck){
        const newTruck = new Truck({
            truck_code: req.body.truck_code,
            truck_desc: req.body.truck_desc,
            type: req.body.type,
            date_created: Date.now()
        })
    
        try{
            await newTruck.save()
            res.status(200).send({"msg": `Truck saved: ${newTruck}`})
        }
        catch(err){
            res.status(400).send({"msg": err});
        }
    }
    

});

//Update truck
router.post('/trucks/update', async (req,res) => {
    try{
        await Truck.updateOne({_id: req.body.id}, {truck_code: req.body.truck_code, type: req.body.type, truck_desc: req.body.truck_desc})
        res.send("ok")
    }
    catch(err){
        res.send(err)
    }
});

//Delete a truck
router.post('/trucks/delete', async (req, res) => {

    const truck = {
      _id: req.body.id
  }

try{
      const deleteTruck = await Truck.deleteOne(truck)
      if(deleteTruck.deletedCount === 1){
          res.status(200).send({"msg": `Product deleted: ${deleteTruck}`})
      }
  }
  catch(err){
      res.send({"msg": err})
  }
});


//Get all trucks
router.get('/trucks/all', async (req, res) => {
    try{
        const getTrucks = await Truck.find()
        res.status(200).send(getTrucks)
    }
    catch(err){
        res.send(err)
    }
})


//Get all products 
router.get('/products/all', async (req, res) => {
    try{
        const getProducts = await Product.find()
        res.status(200).send(getProducts)
    }
    catch(err){
        res.send(err)
    }
})

//Add client
router.post('/clients', async (req, res) => {
    const newClient = new Client({
        order_code: req.body.order_code,
        client_name: req.body.client_name,
        project_total: req.body.project_total,
        project_status: req.body.project_status,
        date_created: Date.now()
    })
    try{
        await newClient.save()
        res.status(200).send({"msg": `Client saved: ${newClient}`})
    }
    catch(err){
        res.status(400).send({"msg": err});
    }
});
//Delete a client 
router.post('/clients/delete', async (req, res) => {
    const client = {
        order_code: req.body.order_code
    }
    try{
        const deleteClient = await Client.deleteOne(client)
        if(deleteClient.deletedCount === 1){
            res.status(200).send({"msg": `Product deleted: ${deleteClient}`})
        }
    }
    catch(err){
        res.send({"msg": err})
    }  
})
//Delete all orders of a client 
router.post('/client/orders/delete', async (req,res) => {
    const client = {
        order_code: req.body.order_code
    }

    try{
        const deleteOrders = await Order.deleteMany(client)
        if(deleteOrders.deletedCount > 0){
            res.status(200).send({"msg": `Orders deleted: ${deleteOrders}`})
        }
    }
    catch(err){
        res.send({"msg": err})
    }  
})


//Get all clients
router.get('/clients', async (req, res) => {
    try{
        const getClients = await Client.find()
        res.status(200).send(getClients)
    }
    catch(err){
        res.send(err)
    }
})

//Get one client 
router.get('/clients/:code', async (req, res) => {
    const code = req.params.code
    try{
        const getClient = await Client.findOne({order_code: code})
        if(getClient)
            res.status(200).send(getClient)
        if(!getClient)
            res.status(404).send({"msg": `Client not found. ${err}`})
    }
    catch(err){
        res.send({"msg": `Client not found. ${err}`})
    }
})

//Update client total
router.post('/clients/update', async (req,res) => {
    const filter = {
        order_code: req.body.order_code
    }
    const checkClient = await Client.findOne(filter)

    if(checkClient){
        const newTotal = {$set: { project_total: req.body.total}} 
        try{
            await Client.updateOne(filter, newTotal, (err, res) => {
                if(err){
                    console.log(err)
                }
            })

        }
        catch(err){
            res.send({"msg":`${err}`})
        }
    }
})

//Update client status
router.post('/clients/update/status', async (req,res) => {
    const filter = {
        order_code: req.body.order_code
    }
    const checkClient = await Client.findOne(filter)
    if(checkClient){
        const newTotal = {$set: { project_status: req.body.status}} 
        try{
            await Client.updateOne(filter, newTotal, (err, res) => {
                if(err){
                    console.log(err)
                }
            })

        }
        catch(err){
            res.send({"msg":`${err}`})
        }
    }
})



//Add an order 
router.post('/orders', async (req, res) => {
    const newOrder = new Order({
        order_code: req.body.order_code,
        client_name: req.body.client_name,
        item: req.body.item,
        truck: req.body.truck,
        price: req.body.price,
        date_created: Date.now()
    })
    try{
        await newOrder.save()
        res.status(200).send({"msg": `Order saved: ${newOrder}`})
    }
    catch(err){
        res.status(400).send({"msg": err});
    }
}) 

//Get all orders from specific order code
router.get('/orders/:code', async (req, res) => {
    const code = req.params.code
    try{
        const getOrder = await Order.find({order_code: code})
        res.status(200).send(getOrder)
    }
    catch(err){
        res.send(err)
    }
})

router.get('/all/orders', async (req,res) => {
    try{
        const getOrder = await Order.find()
        res.status(200).send(getOrder)
    }
    catch(err){
        res.send(err)
    }
})

//Delete an order
router.post('/orders/delete', async (req, res) => {
    const order = {
        _id: req.body.id
    }
    try{
        const deleteOrder = await Order.deleteOne(order)
        if(deleteOrder.deletedCount === 1){
            res.status(200).send({"msg": `Order deleted: ${deleteOrder}`})
        }
    }
    catch(err){
        res.send({"msg": err})
    } 
})

//Update truck
router.post('/orders/update', async (req,res) => {
    try{
        await Order.updateOne({_id: req.body.id}, {item: req.body.item, truck: req.body.truck, price: req.body.price})
        res.send("ok")
    }
    catch(err){
        res.send(err)
    }
});


//Get all employees 
router.get('/employees', async (req,res)=> {
    try{
        const getEmps = await Employee.find()
        res.status(200).send(getEmps)
    }
    catch(err){
        res.send(err)
    }
})
//Add an employee 
router.post('/employees', async (req, res) => {

    const employee = new Employee({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthdate: req.body.birthdate,
        role: req.body.role,
        status: req.body.status,
        date_created: Date.now()
    })

    try{
        await employee.save()
        res.status(200).send({"msg": ` Employee added ${employee}`})
    }
    catch(err){
        res.send({"msg": `Error adding employee ${err}`})

    }
})

//update employee
router.post('/employees/:id', async (req, res) => {
    const id = req.params.id
    try{
        await Employee.updateOne({_id: id}, {
            firstname: req.body.firstname, 
            lastname: req.body.lastname, 
            birthdate: req.body.birthdate, 
            role: req.body.role, 
            status: req.body.status
        })
        res.send("ok")
    }
    catch(err){
        res.send(err)
    }
})
//delete employee
router.delete('/employees', async (req, res) =>{
    const emp = {
        _id: req.body.id
    }

    try{
        const deleteEmp = await Employee.deleteOne(emp)
        if( deleteEmp.deletedCount === 1){
            res.status(200).send({"msg": `Employee deleted: ${ deleteEmp}`})
        }
    }
    catch(err){
        res.send({"msg": err})
    } 
})



module.exports = router;
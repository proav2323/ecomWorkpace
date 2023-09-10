import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import  Jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { JwtSecret, verifyToken, verifyUserAdmin } from './constants.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from './firebase.js'
import  Multer  from 'multer';
import { v4 } from 'uuid';

const uri = "mongodb+srv://anshvishesh03:anshvishesh2007@cluster0.bkcfmqp.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: false,
            deprecationErrors: true,
        }
    }
);
const app = express();
const upload = Multer();
    let db = client.db("ecom-app");
    let usersColl = db.collection("Users");
    let productsCool = db.collection("Products");
    let Orderscoll = db.collection("Orders");
    let categoriesColl = db.collection("Categories");
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

async function run() {
  try {
    await client.connect();
    db = client.db("ecom-app");
    usersColl = db.collection("Users");
    productsCool = db.collection("Products");
    Orderscoll = db.collection("Orders");
    let categoriesColl = db.collection("Categories")
    await db.command({ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(`${err}`);
  }
}

// routes



app.get('/', verifyToken,(req, res) => {
  res.send('ecom app backend');
})

app.post("/auth/login", async (req, res) => {
  const {email, password} = req.body;
  if (email !== '' && password !== "") {
     const data = await usersColl.findOne({email: email});
     if (data !== null) {
      let comparePassword = await bcrypt.compare(password, data.password, (err, same) => {
        if (err) {
          return res.status(404).send("wrong password")
        }
        if (same) {
          let token = Jwt.sign({userId: data._id, email: data.email, role: data.role}, JwtSecret, {expiresIn: "10d"})
        res.status(202).json({
          success: true,
          data: {
            email: data.email,
            userId: data._id,
            token: token
          }
        })
        } else {
          return res.status(404).send("wrong password")
        }
      });
     } else {
      res.status(404).send("user not found")
     }
  } else {
    res.status(401).send("please fill the fields first")
  }
});

app.post("/auth/signUp", async (req, res) => {
const {email, password, name, imgUrl, role, wishlist} = req.body;
if (email !== "" && password !== "" && name !== "" && imgUrl !== "" && role !== "" && wishlist) {
    const data = await usersColl.findOne({email: email});
    if (data === null) {
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = {email: email, password: hashPassword, name: name, imgUrl: imgUrl, role: role, wishlist: wishlist};
       const result = await usersColl.insertOne(newUser);
       console.log(result.insertedId);
       let token = Jwt.sign({userId: result.insertedId, email: email, role: role}, JwtSecret, {expiresIn: "10d"});
       res.status(202).json({
        success: true,
        data: {
          email: email,
          userId: result.insertedId,
          token: token,
        }
       });
    } else {
      res.status(404).send("user found with the email")
    }
} else {
  res.status(404).send("please fill the fields first")
}
});

app.post('/uploadImage', upload.single('file'), (req, res) => {
  const file = req.file;
  if (file !== undefined && file !== null) {
    console.log(file);
const storageRef = ref(storage, 'images/' + file.originalname);
const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
  contentType: req.file.mimetype
});
uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
      case 'success':
    }
  },
  (error) => {
    switch (error.code) {
      case 'storage/unauthorized':
        res.status(502).send("User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        res.status(404).send("User canceled the upload");
        break;

      case 'storage/unknown':
        res.status(502).send("Unknown error occurred")
        break;
    }
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
   res.status(202).json({
    success: true,
    url: downloadURL
   });
    });
  }
);
  } else {
    res.status(404).send("please send a file to continue");
    console.log(file);
    console.log("no file present");
  }
})

app.get("/getUser/:id", async (req, res) => {
  const {id} = req.params;
  if (id !== "") {
   const data = await usersColl.findOne({_id: new ObjectId(id)});
   if (data) {
     res.status(202).json({
      success: true,
      data: data
     });
   } else {
    res.status(404).send({messages: "user not found"})
   }
  } else {
   res.status(404).send("please prfovide a email")
  }
})

app.post("/addProduct", verifyUserAdmin, async (req, res) => {
const {name, images, description, createdOn, price, category, reviews, ratings, stock, isBanner, bannerText} = req.body;
if (images !== undefined && images !== null && images.length !== 0 && name !== "" && description !== "" && createdOn !== null && price !== 0 && category !== "" && ratings !== null && ratings !== undefined && stock !== 0 && isBanner !== undefined && isBanner !== null && bannerText) {
  // const newDate = JSON.parse(createdOn);
const newProduct = {name: name, description: description, images: images, createdOn: new Date(createdOn), price: price, category: category, reviews: reviews, ratings: ratings, stock: stock, isBanner: isBanner, bannerText: bannerText, _id: v4()}
const result = await productsCool.insertOne(newProduct);
// console.log(newDate)
if (result) {
  console.log(result.insertedId);
  res.status(202).json({success: true, data: `product added with ${result.insertedId} id`})
} else {
  res.status(502).send("internal error");
}
} else {
  res.status(404).send("please fill the fields")
}
})

app.get("/getAllProducts", async (req, res) => {
  const products = [];
  const data = productsCool.find();
  if (data) {
for await (const doc of data) {
  products.push(doc);
}

res.status(202).json({
  success: true,
  data: products
});
  } else {
    res.status(502).send("internal error")
}
})

app.get("/getAllUsers",async (req, res) => {
  const users = [];
  const data = usersColl.find();
  if (data) {
for await (const doc of data) {
  users.push(doc);
}
res.status(202).json({
  success: true,
  data: users
});
  } else {
    res.status(502).send("internal error");
  }
})

app.get("/getAllOrders", verifyUserAdmin ,async (req, res) => {
    const users = [];
  const data = Orderscoll.find();
  if (data) {
for await (const doc of data) {
  users.push(doc);
}
res.status(202).json({
  success: true,
  data: users
});
  } else {
    res.status(502).send("internal error");
  }
})

app.get("/getSingleProduct/:id", async(req, res) => {
  const {id} = req.params;
  if (id) {
      const data = await productsCool.findOne({_id: id},);
      if (data) {
        res.status(202).json({
          success: true,
          data: data
        });
      } else  {
        res.status(404).send("product not found")
      }
  } else {
    res.status(403).send("please enter id");
  }
})

app.put("/updateProduct", async (req, res) => {
  const {name, images, description, price, category, id, ratings, reviews ,stock, isBanner, bannerText} = req.body;
  if (images !== undefined && images !== null && images.length !== 0 && name !== "" && description !== "" && price !== 0 && category !== "" && id !== ""  && bannerText) {
     const newData = {
      $set: {
      name: name,
      images: images,
      description: description,
      price: price,
      category: category,
      ratings: ratings,
      stock: stock,
      reviews: reviews,
      isBanner: isBanner,
      bannerText: bannerText
      },}
     const data = await productsCool.updateOne({_id: id}, newData, {});
     if (data.matchedCount !== 0) {
      res.status(201).json({success: true, message: "product updated successfully"})
     } else {
      res.status(503).send("something went wrong please try again later or contact admin for further assistance");
     }
  } else  {
    res.status(403).send("please fillt he fields");
  }
});

app.delete("/deleteProduct/:id", verifyUserAdmin ,async (req, res) => {
  const {id} = req.params;
  if (id) {
   const data = await productsCool.deleteOne({_id: id},);
   if (data) {
    res.status(202).json({
      success: true,
      data: "product deleted"
    })
   } else {
    res.status(503).send("something went wrong")
   }
  } else {
    res.status(403).send("please enter id");
  }
})

app.put("/updateUser/:id", verifyToken ,async (req, res) => {
  const {id} = req.params;
  const {email, name, imgUrl, role, wishlist} = req.body;
if (email !== "" && email && name !== "" && name && imgUrl !== "" && imgUrl && role !== "" && role && id !== "" && id) {
const newData = {
  $set: {
    name: name,
    email: email,
    imgUrl: imgUrl,
    role: role,
    wishlist: wishlist
  }
}
console.log(id);
const data = await usersColl.updateOne({_id: new ObjectId(id)}, newData);
if (data.modifiedCount !== 0) {
res.status(202).json({
  success: true,
  data: "user updated"
})
} else {
  res.status(503).send("something went wrong")
  console.log(data);
}
} else {
  res.status(403).send("please fill the fields")
}
})

app.delete("/deleteUser/:id", verifyUserAdmin ,async(req, res) => {
  const {id} = req.params;
  if (id) {
       const data = await usersColl.deleteOne({_id: new ObjectId(id)});
   if (data) {
    res.status(202).json({
      success: true,
      data: "user deleted"
    })
   } else {
    res.status(503).send("something went wrong")
   }
  } else {
    res.status(403).send("please enter id");
  }
})

app.post("/addOrder", verifyToken ,async (req, res) => {
const {cart, orderedBy, orderedOn, price, paymentMethod, cardDetails, address, delivered, status} = req.body;
console.log(delivered);
if (cart && orderedBy !== "" && orderedOn && price !== 0 && paymentMethod !== "" && cardDetails && address && delivered !== null && delivered !== undefined && status) {
   const newData = {cart: cart, orderedBy: orderedBy, orderedOn: new Date(orderedOn), price: price, paymentMethod: paymentMethod, cardDetails: cardDetails, address: address, delivered: delivered, status: status}
   const data = await Orderscoll.insertOne(newData);
   if (data) {
      res.status(202).json({success: true, data: `order added with ${data.insertedId} id`})
   } else {
    res.status(503).send("internal error")
   }
} else {
  res.status(403).send("please send full fields")
}
})

app.put("/updateOrder/:id", verifyUserAdmin ,async(req, res) => {
  const {id} = req.params;
  const {delivered, status} = req.body;
  if (delivered !== null && delivered !== undefined && id && status) {
    const newData = {
      $set: {
        delivered: delivered,
        status: status,
      }
    }
    console.log(id);
    const data = await Orderscoll.updateOne({_id: new ObjectId(id)}, newData);
    if (data.modifiedCount !== 0) {
        res.status(202).json({success: true, data: "ordered updated"})
    } else {
       res.status(503).send("internal error");
    }
  } else {
    res.status(403).send("please fill the fileds")
  }
})

app.delete("/deleteOrder/:id", verifyUserAdmin ,async(req, res) => {
  const {id} = req.params;
  if (id) {
          const data = await Orderscoll.deleteOne({_id: new ObjectId(id)});
   if (data) {
    res.status(202).json({
      success: true,
      data: "order deleted"
    })
   } else {
    res.status(503).send("something went wrong")
   }
  } else {
  res.status(403).send("please send a valid id")
  }
})

app.get("/getUsersOrders/:userId", verifyToken , async(req, res) => {
  const {userId} = req.params;
  console.log("hi")
  if (userId) {
    const data = Orderscoll.find({orderedBy: userId})
    if (data) {
      const orders = [];
for await (const doc of data) {
  orders.push(doc);
}
res.status(202).json({success: true,orders : orders });
    } else {
      res.status(404).send('no orders found')
    }
  } else {
    res.status(401).send("please send a user");
  }
})

app.get("/logincheckToken", (req, res) => {
      const token = req.headers['authorization'];
       console.log(token)
    if (!token) return res.status(202).send(true);

    Jwt.verify(token, JwtSecret, (err, decoded) => {
        console.log(err);
        if (err) return res.status(202).send(true)
        return res.status(202).send(false);
    });
})

app.get("/decodeToken/:token", (req, res) => {
  const {token} = req.params;
  if (token) {
    Jwt.verify(token, JwtSecret, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        res.status(202).json({id: decoded.userId});
    });
  } else {
    res.status(403).send("no token")
  }
})

app.get("/adminCheck", (req, res) => {
        const token = req.headers['authorization'];
       console.log(token)
    if (!token) return res.status(402).send(false);

    Jwt.verify(token, JwtSecret, (err, decoded) => {
        console.log(err);
        if (err) return res.status(402).send(false)
        if (decoded.role === "admin") {
        return res.status(202).send(true);
        } else {
          return res.status(403).send("not a admin")
        }
    });
})
app.get("/userCheck", (req, res) => {
        const token = req.headers['authorization'];
       console.log(token)
    if (!token) return res.status(402).send(false);

    Jwt.verify(token, JwtSecret, (err, decoded) => {
        console.log(err);
        if (err) return res.status(402).send(false)
          return res.status(202).send(true)
    });
})

app.get("/getDashbourdOrders", async(req, res) => {
  const data = [];
for (let i = 0; i < 7; i++) {
    let date = new Date();
  const cursor = Orderscoll.find({
          orderedOn: {$gte: new Date(new Date(new Date(Date.now()).setDate(date.getDate() - i)).setHours(0o0, 0o1, 0o0)),$lt: new Date(new Date(new Date(Date.now()).setDate(date.getDate() - i)).setHours(23, 59, 59))}
  })
  console.log({
        $gte: new Date(new Date(new Date(Date.now()).setDate(date.getDate() - i))),
        $lt: new Date(new Date(new Date(Date.now()).setDate(date.getDate() - i)).setHours(23, 59, 59)),
  })
  const day = new Date(new Date(new Date(Date.now()).setDate(date.getDate() - i)).setHours(0o1, 20, 59));
    const values = [];
  for await (const doc of cursor) {
  values.push(doc);
}
  const realdata = {data: values, day: day}
  console.log(realdata);
  data.push(realdata);
}
if (data) {
  res.status(202).json({success: true, data: data})
} else {
  res.status(503).send("internal error")
}
})

app.get("/getAllCategories", verifyToken ,async(req, res) => {
       const users = [];
  const data = categoriesColl.find();
  if (data) {
for await (const doc of data) {
  users.push(doc);
}
res.status(202).json({
  success: true,
  data: users
});
  } else {
    res.status(502).send("internal error");
  }
})

app.post("/addCategories", verifyUserAdmin ,async(req, res) => {
  const {name, imgUrl} = req.body;
  if (name && imgUrl) {
     const newData = {name: name, imgUrl: imgUrl}
     const data = await categoriesColl.insertOne(newData);
     if (data) {
      res.status(202).json({
        success: true,
        data: "categories added"
      })
     } else {
      return res.status(503).send("internal error")
     }
  } else {
    return res.status(403).send('send values');
  }
})

app.put("/updateCategory/:id", verifyUserAdmin ,(req, res) => {
  const {id} = req.params;
  const {name, imgUrl} = req.body;
  if (name && imgUrl) {
      const newData = {$set: {
        name: name,
        imgUrl: imgUrl
      }};
      const data = categoriesColl.updateOne( {_id: new ObjectId(id)}, newData,);
      if (data) {
        res.status(202).json({
          success: true,
          messages: "categoty updated"
        })
      } else {
        return  res.status(501).send("Internal Error");
      }
  } else {
    return res.status(403).send('send values');
  }
})

app.delete("/deleteCategory/:id", verifyUserAdmin ,async(req, res) => {
    const {id} = req.params;
  if (id) {
          const data = await categoriesColl.deleteOne({_id: new ObjectId(id)},);
   if (data) {
    res.status(202).json({
      success: true,
      data: "category deleted"
    })
   } else {
    res.status(503).send("something went wrong")
   }
  } else {
  res.status(403).send("please send a valid id")
  }
})

app.get("/bannerProduct", async(req, res) => {
    const data = await productsCool.findOne({isBanner: true})
    if (data) {
    res.status(202).json({success: true, data: data})
 } else {
  res.status(404).send(`no banner product found`)
 }
})
app.get("/getCategoryProducts/:categoryName", async (req, res) => {
 const {categoryName} = req.params;
 if (categoryName) {
  if (categoryName === "all") {
  const cursor = productsCool.find().limit(5);
  const data = [];
  for await (let doc of cursor) {
   data.push(doc);
  }
  if (data) {
   res.status(202).json({success: true, data: data})
  } else {
    res.status(502).send("internal error")
  }
  } else {
  const cursor = productsCool.find({category: categoryName}).limit(5);
  const data = [];
  for await (let doc of cursor) {
   data.push(doc);
  }
  if (data) {
   res.status(202).json({success: true, data: data})
  } else {
    res.status(502).send("internal error")
  }
  }
 } else {
  res.status(403).send("send a category name")
 }
})

app.get("/getSearchProducts/:search", async(req, res) => {
 const result = productsCool.createIndex({name: "text", category: "text", description: "text"})
 console.log(result);
  const {search} = req.params;
  if (search) {
    const query = {$text: {$search: search}}
   const cursor = productsCool.find(query);
   const data = [];
   for await (let doc of cursor) {
    data.push(doc)
   }
   res.status(202).json({success: true, data: data})
  } else {
    res.status(403).send("send a search")
  }
})
app.put("/updateProductStock", async (req, res) => {
  const {stock, id} = req.body;
  if (stock) {
     const newData = {
      $set: {
      stock: stock,
      },}
     const data = await productsCool.updateOne({_id: id}, newData, {});
     if (data.matchedCount !== 0) {
      res.status(201).json({success: true, message: "product updated successfully"})
     } else {
      res.status(503).send("something went wrong please try again later or contact admin for further assistance");
     }
  } else  {
    res.status(403).send("please fillt he fields");
  }
});
//  listening on port
app.listen(3000, () => {
  run().catch(console.dir);
  console.log("hosted on http://localhost:3000");
})


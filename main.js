const FormData = require('form-data')
const axios = require('axios')
const fs = require('fs')

const express = require("express")
const app = express();
var multer = require("multer");
const env = require("dotenv");
env.config();
const admin = require('firebase-admin');
var firestore = require("firebase-admin/firestore");
var firebase_storage = require('firebase-admin/storage');
const bodyParser = require('body-parser');
const path = require('path')


const API_KEY = process.env.API_KEY


// Initialize Firebase Admin SDK
// const serviceAccount = require(Firebase_key);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_project_id,
    clientEmail: process.env.FIREBASE_client_email,
    privateKey: process.env.FIREBASE_project_key?.replace(/\\n/g, '\n'),
  }),
  databaseURL: "https://fir-node-60d01-default-rtdb.firebaseio.com",
  storageBucket: "gs://fir-node-60d01.appspot.com"
});

// Get a reference to the Firestore database
const db = admin.firestore();

app.use(bodyParser.json());

// get reward user1
app.get('/reward1', async (req, res) => {
  try {
    const snapshot = await db.collection('mozzi').doc('id1').collection('pay').get();
    var st1 = 0;
    var st2 = 0;
    var st3 = 0;
    var st4 = 0;
    var st5 = 0;
    var st6 = 0;
    const documents = [];
    
    var {stamp1, stamp2, stamp3, stamp4, stamp5, stamp6} = {stamp1 : false, stamp2 : false, stamp3 : false, stamp4 : false, stamp5 : false, stamp6 : false}
    
    snapshot.forEach((doc) => {
      st1++;
      if(doc.data().category == "식사") {
        st2++
      }
      if(!documents.includes(doc.data().address)) {
        st3++
      } else {
        console.log("equal");
      }
      documents.push(doc.data().address)
      if(doc.data().category == "여가") {
        st4++
      }
      if(doc.data().category == "쇼핑") {
        st5++
      }
      if(doc.data().category == "카페") {
        st6++
      }
    })

    if(st1 >= 2) {
      stamp1 = true
    }
    if(st2 >= 2) {
      stamp2 = true
    }
    if(st3 >= 2) {
      stamp3 = true
    }
    if(st4 >= 2) {
      stamp4 = true
    }
    if(st5 >= 2) {
      stamp5 = true
    }
    if(st6 >= 2) {
      stamp6 = true
    }

    console.log(st3)
    res.json({
      stamp1,
      stamp2,
      stamp3,
      stamp4,
      stamp5,
      stamp6
    })
  } catch(error) {
    console.error('Error retrieving documents:', error);
  }
})

app.get('/reward2', async (req, res) => {
  try {
    const snapshot = await db.collection('mozzi').doc('id2').collection('pay').get();
    var st1 = 0;
    var st2 = 0;
    var st3 = 0;
    var st4 = 0;
    var st5 = 0;
    var st6 = 0;
    const documents = [];
    
    var {stamp1, stamp2, stamp3, stamp4, stamp5, stamp6} = {stamp1 : false, stamp2 : false, stamp3 : false, stamp4 : false, stamp5 : false, stamp6 : false}
    
    snapshot.forEach((doc) => {
      st1++;
      if(doc.data().category == "식사") {
        st2++
      }
      if(!documents.includes(doc.data().address)) {
        st3++
      } else {
        console.log("equal");
      }
      documents.push(doc.data().address)
      if(doc.data().category == "여가") {
        st4++
      }
      if(doc.data().category == "쇼핑") {
        st5++
      }
      if(doc.data().category == "카페") {
        st6++
      }
    })

    if(st1 >= 2) {
      stamp1 = true
    }
    if(st2 >= 2) {
      stamp2 = true
    }
    if(st3 >= 2) {
      stamp3 = true
    }
    if(st4 >= 2) {
      stamp4 = true
    }
    if(st5 >= 2) {
      stamp5 = true
    }
    if(st6 >= 2) {
      stamp6 = true
    }

    console.log(st3)
    res.json({
      stamp1,
      stamp2,
      stamp3,
      stamp4,
      stamp5,
      stamp6
    })
  } catch(error) {
    console.error('Error retrieving documents:', error);
  }
})

app.get('/reward3', async (req, res) => {
  try {
    const snapshot = await db.collection('mozzi').doc('id3').collection('pay').get();
    var st1 = 0;
    var st2 = 0;
    var st3 = 0;
    var st4 = 0;
    var st5 = 0;
    var st6 = 0;
    const documents = [];
    
    var {stamp1, stamp2, stamp3, stamp4, stamp5, stamp6} = {stamp1 : false, stamp2 : false, stamp3 : false, stamp4 : false, stamp5 : false, stamp6 : false}
    
    snapshot.forEach((doc) => {
      st1++;
      if(doc.data().category == "식사") {
        st2++
      }
      if(!documents.includes(doc.data().address)) {
        st3++
      } else {
        console.log("equal");
      }
      documents.push(doc.data().address)
      if(doc.data().category == "여가") {
        st4++
      }
      if(doc.data().category == "쇼핑") {
        st5++
      }
      if(doc.data().category == "카페") {
        st6++
      }
    })

    if(st1 >= 2) {
      stamp1 = true
    }
    if(st2 >= 2) {
      stamp2 = true
    }
    if(st3 >= 2) {
      stamp3 = true
    }
    if(st4 >= 2) {
      stamp4 = true
    }
    if(st5 >= 2) {
      stamp5 = true
    }
    if(st6 >= 2) {
      stamp6 = true
    }

    res.json({
      stamp1,
      stamp2,
      stamp3,
      stamp4,
      stamp5,
      stamp6
    })
  } catch(error) {
    console.error('Error retrieving documents:', error);
  }
})

const bucket = admin.storage().bucket("gs://fir-node-60d01.appspot.com");


app.get(`/image/:imagePath`, async (req, res) => {
  // Retrieve the image from Firebase Storage
  try {
    
    const imagePath = req.params.imagePath;

    // 이미지를 다운로드하여 저장합니다.

      const localFilePath = `uploads/${imagePath}`; // 저장할 로컬 경로

      await bucket.file(`pay/${imagePath}`).download({ destination: localFilePath });
    
      res.sendFile(localFilePath , {root:__dirname});
  } catch (error) {
    console.error('Error retrieving and sending images:', error);
    res.sendStatus(500);
  }

});



// Define a route for '/data'
app.get(`/data`, async (req, res) => {
  try {
    // console.log(req.body.id);

    const snapshot = await db.collection('mozzi').doc("id1").collection("pay").get();
    

    const documents = [];

    snapshot.forEach((doc) => {
        console.log(doc.data())
        documents.push(doc.data());
    });

    res.json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
});


app.get(`/data1`, async (req, res) => {
  try {

    const snapshot = await db.collection('mozzi').doc("id1").collection("pay").get();


    const documents = [];

    snapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    res.json(documents);

  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
});

app.get(`/data2`, async (req, res) => {
  try {

    const snapshot = await db.collection('mozzi').doc("id2").collection("pay").get();

    const documents = [];

    snapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    res.json(documents);

  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
});

app.get(`/data3`, async (req, res) => {
  try {

    const snapshot = await db.collection('mozzi').doc("id3").collection("pay").get();

    const documents = [];

    snapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    res.json(documents);

  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'An error occurred while retrieving documents.' });
  }
});


app.post('/add1', async (req, res) => {
  try {
    console.log(req.body)
    const { storeName, address, price, item, itemPrice, date, category, point, memo } = req.body;

    // Create a new document in the specified collection
    await db.collection('mozzi').doc('id1').collection('pay').add({
      storeName : storeName, // 가게 이름
      address : address, // 주소
      price : price, // 가격 
      item : item, // 항목 
      itemPrice : itemPrice, // 항목이름
      date : date, // 날짜
      category : category, // 카테고리
      point : point, // 만족도
      memo : memo //메모
    });

    res.send('Data added successfully');
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('An error occurred while adding data.');
  }
});

app.post('/add2', async (req, res) => {
  try {
    const { storeName, address, price, item, itemPrice, date, category, point, memo } = req.body;

    // Create a new document in the specified collection
    await db.collection('mozzi').doc('id2').collection('pay').add({
      storeName : storeName, // 가게 이름
      address : address, // 주소
      price : price, // 가격 
      item : item, // 항목 
      itemPrice : itemPrice, // 항목이름
      date : date, // 날짜
      category : category, // 카테고리
      point : point, // 만족도
      memo : memo //메모
    });

    res.send('Data added successfully');
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('An error occurred while adding data.');
  }
});

app.post('/add3', async (req, res) => {
  try {
    const { storeName, address, price, item, itemPrice, date, category, point, memo } = req.body;

    // Create a new document in the specified collection
    await db.collection('mozzi').doc('id3').collection('pay').add({
      storeName : storeName, // 가게 이름
      address : address, // 주소
      price : price, // 가격 
      item : item, // 항목 
      itemPrice : itemPrice, // 항목이름
      date : date, // 날짜
      category : category, // 카테고리
      point : point, // 만족도
      memo : memo //메모
    });

    res.send('Data added successfully');
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('An error occurred while adding data.');
  }
});


//getter setter 문제 해결 필요
class PayInfo {
  constructor(address, price, date, name, itemName, itemCount, itemPrice, time) {
    this._address = address;
    this._price = price;
    this._date = date;
    this._name = name;
    this._itemName = itemName;
    this._itemCount = itemCount;
    this._itemPrice = itemPrice;
    this._time = time;
  }

  get date() {
    return this._date;
  }
  get price() {
    return this._price
  }
  get address() {
    return this._address
  }
  get name() {
    return this._name
  }

  set address(address1) {
    this._address = address1;
  }

  set price(price1) {
    this._price = price1;
  }
  set date(date1) {
    this._date = date1;
  }
  set name(name1) {
    this._name = name1;
  }
}


// 백 연동시 이 부분 수정 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// multer 미들웨어 설정
const upload = multer({ storage: storage});
app.get('/', (req,res) => {
  res.send("hello world");
})


app.post('/imageUpload1', upload.single("image"), async (req, res) => {
  try {
    const filename = req.file.filename;

    bucket.upload(`uploads/${filename}`, {
      destination: `pay/${filename}`,
      metadata: {
        contentType: 'image/jpeg',
        // Add additional metadata properties as needed
      },
    }).then(() => {
      console.log('Image uploaded successfully to Firebase Storage.');
      res.send("data add success")
    })
    .catch((error) => {
      console.error('Error uploading image to Firebase Storage:', error);
    });

    const collectionRef = db.collection('mozzi').doc("id1").collection('pay');
    collectionRef
    .orderBy('createdAt', 'desc') // createdAt 필드를 기준으로 내림차순으로 정렬\
    
    collectionRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        console.log('No documents found in the collection.');
        return;
      }

      const latestDocument = querySnapshot.docs[(querySnapshot.size-1)];
      const documentRef = collectionRef.doc(latestDocument.id);

      // 문서에 추가 데이터 추가
      documentRef
        .update({imagePath : filename})
        .then(() => {
          console.log('Additional data added to the latest document successfully.');
        })
        .catch((error) => {
          console.error('Error adding additional data to the document:', error);
        });
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });
  } catch(error) {
    console.log(error);
  }
})

app.post('/imageUpload2', upload.single("image"), async (req, res) => {
  try {
    const filename = req.file.filename;

    bucket.upload(`uploads/${filename}`, {
      destination: `pay/${filename}`,
      metadata: {
        contentType: 'image/jpeg',
        // Add additional metadata properties as needed
      },
    }).then(() => {
      console.log('Image uploaded successfully to Firebase Storage.');
      res.send("data add success")
    })
    .catch((error) => {
      console.error('Error uploading image to Firebase Storage:', error);
    });

    const collectionRef = db.collection('mozzi').doc("id2").collection('pay');
    collectionRef
    .orderBy('createdAt', 'desc') // createdAt 필드를 기준으로 내림차순으로 정렬\
    
    collectionRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        console.log('No documents found in the collection.');
        return;
      }

      const latestDocument = querySnapshot.docs[(querySnapshot.size-1)];
      const documentRef = collectionRef.doc(latestDocument.id);

      // 문서에 추가 데이터 추가
      documentRef
        .update({imagePath : filename})
        .then(() => {
          console.log('Additional data added to the latest document successfully.');
        })
        .catch((error) => {
          console.error('Error adding additional data to the document:', error);
        });
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });
  } catch(error) {
    console.log(error);
  }
})


app.post('/imageUpload3', upload.single("image"), async (req, res) => {
  try {
    const filename = req.file.filename;

    bucket.upload(`uploads/${filename}`, {
      destination: `pay/${filename}`,
      metadata: {
        contentType: 'image/jpeg',
        // Add additional metadata properties as needed
      },
    }).then(() => {
      console.log('Image uploaded successfully to Firebase Storage.');
      res.send("data add success")
    })
    .catch((error) => {
      console.error('Error uploading image to Firebase Storage:', error);
    });

    const collectionRef = db.collection('mozzi').doc("id3").collection('pay');
    collectionRef
    .orderBy('createdAt', 'desc') // createdAt 필드를 기준으로 내림차순으로 정렬\
    
    collectionRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        console.log('No documents found in the collection.');
        return;
      }

      const latestDocument = querySnapshot.docs[(querySnapshot.size-1)];
      const documentRef = collectionRef.doc(latestDocument.id);

      // 문서에 추가 데이터 추가
      documentRef
        .update({imagePath : filename})
        .then(() => {
          console.log('Additional data added to the latest document successfully.');
        })
        .catch((error) => {
          console.error('Error adding additional data to the document:', error);
        });
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });
  } catch(error) {
    console.log(error);
  }
})

// 이미지 업로드를 처리하는 라우트
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // 업로드된 이미지 파일의 경로와 파일명 반환
    const { path, filename } = req.file;
    // 클라이언트에게 응답 보내기

    await requestWithFile(filename, function() {
      const address = payInfo.address;
      const price = payInfo.price;
      const date = payInfo.date;
      const name = payInfo.name;
      const time = payInfo.time;
      const itemName = []

      payInfo._itemName.forEach(element => {
        itemName.push(element)
      });

      const itemCount = []
      payInfo._itemCount.forEach(element => {
        itemCount.push(element)
      });

      const itemPrice = []
      payInfo._itemPrice.forEach(element => {
        itemPrice.push(element)
      });

      res.json({
          name,
          price,
          date,
          address,
          itemName,
          itemCount,
          itemPrice,
          time
        });
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ title: "Error", message: "Something went wrong!" });
  }}
);

const dataSet = {}

app.listen(8080, () => console.log('Server running'));

const payInfo = new PayInfo(" "," "," "," ",[],[],[]," ");

async function requestWithFile (filename, callback) {
  const file = fs.createReadStream(`uploads/${filename}`) // image file object. Example: fs.createReadStream('./example.png')
  

  const message = {
    images: [
      {
        format: filename.split('.')[1], // file format
        name: filename.split('.')[0] // file name
      }
    ],
    requestId: 'data', // unique string
    timestamp: 0,
    version: 'V2'
  }
  const formData = new FormData()

  formData.append('file', file)
  formData.append('message', JSON.stringify(message))

  axios
    .post(
      'https://p9kjr20suo.apigw.ntruss.com/custom/v1/22151/e5083a02be86c91dde220ab7e31b9dd202caa507bc1ac0e56a1c499c7a3d9dc3/document/receipt', // APIGW Invoke URL
      formData,
      {
        headers: {
          'X-OCR-SECRET': API_KEY, // Secret Key 
          ...formData.getHeaders()
        }
      }
    )
    .then(res => {
      if (res.status === 200) {

        // console.log('requestWithFile response:', JSON.stringify(res.data, null, 2))
        const obj = res.data.images[0].receipt.result
        if('storeInfo' in obj) {
          payInfo.name = obj.storeInfo.name.text
          if('subName' in obj.storeInfo) {
            payInfo.name += ' ' + obj.storeInfo.subName.text
          }
        }
        
        if('paymentInfo' in obj) {
          payInfo.date = obj.paymentInfo.date.formatted.year + "-" + obj.paymentInfo.date.formatted.month + "-" + obj.paymentInfo.date.formatted.day
          if('time' in obj.paymentInfo) {
            payInfo.time = obj.paymentInfo.time.formatted.hour + " : " + obj.paymentInfo.time.formatted.minute + " : " + obj.paymentInfo.time.formatted.second
          }
        }

        if('totalPrice' in obj) {
          payInfo.price = obj.totalPrice.price.text
        }
        if('addresses' in obj.storeInfo) {
          payInfo.address = obj.storeInfo.addresses[0].text
        } 
        
        payInfo._itemName = []
        payInfo._itemCount = []
        payInfo._itemPrice = []

        if(obj.subResults.length > 0) {
          const subResults = obj.subResults[0].items
          
          subResults.forEach(element => {
            if('name' in element) {
              payInfo._itemName.push(element.name.text);
            }
            if('count' in element) {
              payInfo._itemCount.push(element.count.text); 
            }
            if('price' in element) {
              payInfo._itemPrice.push(element.price.price.text);
            }
          });
        }
        console.log("success")
        callback()
      }
    })
    .catch(e => {
      console.warn('requestWithFile error', e.response)
    })
}

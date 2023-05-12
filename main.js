const FormData = require('form-data')
const axios = require('axios')
const fs = require('fs')

const express = require("express")
const app = express();
var multer = require("multer");
const env = require("dotenv");
env.config();

const API_KEY = process.env.API_KEY

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

// 이미지 업로드를 처리하는 라우트
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // 업로드된 이미지 파일의 경로와 파일명 반환
    const { path, filename } = req.file;
    // 클라이언트에게 응답 보내기

  // console.log("filename " , typeof(filename))
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
        });})
  } catch (error) {
    console.error(error);
    res.status(500).json({ title: "Error", message: "Something went wrong!" });
  }}
);

app.listen(8080, () => console.log('Server running'));

const payInfo = new PayInfo("","","","",[],[],[],"");

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
        // console.log('requestWithFile response:', res.data)
        const obj = Object.values(Object.values(Object.values(Object.values(Object.values(res.data)[3]))[0])[0])[1]
        if('storeInfo' in obj) {
          payInfo.name = obj.storeInfo.name.text
          if('subName' in obj.storeInfo) {
            payInfo.name += ' ' + obj.storeInfo.subName.text
          }
        }
        
        if('paymentInfo' in obj) {
          payInfo.date = formatDate(obj.paymentInfo.date.text)
          if('time' in obj.paymentInfo) {
            payInfo.time = obj.paymentInfo.time.text
          }
        }

        if('totalPrice' in obj) {
          payInfo.price = obj.totalPrice.price.text
        }
        if('addresses' in obj.storeInfo) {
          payInfo.address = (Object.values(Object.values(obj)[0])[3])[0].text
        } 
          var array = (Object.values(obj)[2])[0].items

          payInfo._itemName = []
          payInfo._itemCount = []
          payInfo._itemPrice = []
          
          array.forEach(element => {
              if('name' in element) {
                console.log(payInfo._itemName)
                payInfo._itemName.push(element.name.text);
                console.log(payInfo._itemName)
              } 
              if('count' in element) {
                console.log(payInfo._itemCount)
                payInfo._itemCount.push(element.count.text); 
                console.log(payInfo._itemCount)
              } 
              if('price' in element) {
                console.log(payInfo._itemPrice)
                payInfo._itemPrice.push(element.price.price.text);
                console.log(payInfo._itemPrice)
              }
          });
          console.log("success")
          callback()
      }
    })
    .catch(e => {
      console.warn('requestWithFile error', e.response)
    })
}


function formatDate(input) {
  const match = input.match(/^(\d{4})[-\/]?(\d{2})[-\/]?(\d{2})$/);
  if (!match) {
    throw new Error('Invalid input format');
  }
  
  const year = match[1];
  const month = match[2];
  const day = match[3];
  
  return `${year}-${month}-${day}`;
}

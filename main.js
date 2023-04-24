const FormData = require('form-data')
const axios = require('axios')
const fs = require('fs')

const express = require("express")
const app = express();
var multer = require("multer");
const env = require("dotenv");
env.config();

const apiKey = process.env.API_KEY

//getter setter 문제 해결 필요
class PayInfo {
  constructor(address, price, date, name) {
    this._address = address;
    this._price = price;
    this._date = date;
    this._name = name;
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

//_______________________________________________________________________________
// app.use(express.static(path.join(__dirname, '/')));

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
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    // 업로드된 이미지 파일의 경로와 파일명 반환
    const { path, filename } = req.file;
    // 클라이언트에게 응답 보내기

  // console.log("filename " , typeof(filename))
    requestWithFile(filename)
    setTimeout(() => {
      const address = payInfo.address;
      const price = payInfo.price;
      const date = payInfo.date;
      const name = payInfo.name;
      res.json({
          name,
          price,
          date,
          address,
        });
      },8000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ title: "Error", message: "Something went wrong!" });
  }}
);

app.listen(8080, () => console.log('Server running'));

const payInfo = new PayInfo("","","","");

// function requestWithBase64 () {
//   axios
//     .post(
//       'https://p9kjr20suo.apigw.ntruss.com/custom/v1/22095/3eeeb774736d9ff549ce7578632cc717d37ed5347c07dd8cf691d03796235ecd/document/receipt', // APIGW Invoke URL
//       {
//         images: [
//           {
//             format: 'jpeg', // file format
//             name: 'rec', // image name
//             data: ''
//           }
//         ],
//         requestId: '22077', // unique string
//         timestamp: 0,
//         version: 'V2'
//       },
//       {
//         headers: {
//           'X-OCR-SECRET': 'Ymh1Q3JuYUl2Q3R6SFVXYVVHcHBuUk12TVlDb1BFaGk=' // Secret Key 
//         }
//       }
//     )
//     .then(res => {
//       if (res.status === 200) {
//         console.log('requestWithBase64 response:', res.data)
//       }
//     })
//     .catch(e => {
//       console.warn('requestWithBase64 error', e.response)
//     })
// }

function requestWithFile (filename) {
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
      'https://p9kjr20suo.apigw.ntruss.com/custom/v1/22095/3eeeb774736d9ff549ce7578632cc717d37ed5347c07dd8cf691d03796235ecd/document/receipt', // APIGW Invoke URL
      formData,
      {
        headers: {
          'X-OCR-SECRET': apiKey, // Secret Key 
          ...formData.getHeaders()
        }
      }
    )
    .then(res => {
      if (res.status === 200) {
        // console.log('requestWithFile response:', res.data)
        const obj = Object.values(Object.values(Object.values(Object.values(Object.values(res.data)[3]))[0])[0])[1]
        payInfo.name = obj.storeInfo.name.text + ' ' +obj.storeInfo.subName.text
        payInfo.date = '2023-' + obj.paymentInfo.date.text
        payInfo.price = obj.totalPrice.price.text
        payInfo.address = (Object.values(Object.values(obj)[0])[3])[0].text
        console.log("success")
        // payInfo.address
      }
    })
    .catch(e => {
      console.warn('requestWithFile error', e.response)
    })
}

// requestWithBase64()
// requestWithFile()


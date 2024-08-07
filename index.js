const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// CORS'u etkinleştir
app.use(cors());

const {
    initializeApp,
    applicationDefault,
    cert
} = require('firebase-admin/app');
const {
    getFirestore,
    Timestamp,
    FieldValue,
    Filter
} = require('firebase-admin/firestore');

const serviceAccount = require('./akkim-grafik-firebase-adminsdk.json');

initializeApp({
    credential: cert(serviceAccount)
});

// Firestore database instance
const db = getFirestore();

// Public klasörünü statik dosyalar için kullan
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public'));
});

const veriler = {
    data_1: [],
    data_2: []
}

let calculate1 = () => {
    let sonuc = {}
    for (let i = 1; i < 7; i++) {
        sonuc[`data_${i}`] = (veriler.data_1[0][`analiz${i}`] - veriler.data_2[0].analiz1)
    }
    return sonuc;
}

let calculate2 = () => {
    let sonuc = {}
    for (let i = 1; i < 7; i++) {
        sonuc[`performans${i}`] = (calculate1()[`data_${i}`] / 9.5) * 100;  
    }
    return sonuc;
}

let veriGetir = () => {
    console.log("----------- START -----------")

    // Firestore'dan veriyi okur
    async function readData() {
        try {
            const snapshot = await db.collection('data-1').get();
            snapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                veriler.data_1.push(doc.data());
            });
            const snapshot2 = await db.collection('data-2').get();
            snapshot2.forEach((doc) => {
                // let usersArray = [];
                // usersArray.push(doc.data());
                // console.log(usersArray[0])
                veriler.data_2.push(doc.data());
                // console.log(doc.id, '=>', doc.data());
            });
            return '----------- Başarılı: Veri okuma işlemleri başarılı. -----------';
        } catch (error) {
            console.error('Veri okumada hata oluştu:', error);
        }
    }

    // Veri eklemeyi ve okumayı gerçekleştir
    async function performOperations() {
        const readResult = await readData();
        console.log(readResult);
        console.log("----------- END ! -----------")
        return veriler;
    }

    return performOperations();
}

let result = {}

app.get('/sonuclar', (req, res) => {
    let gelenVeriler = veriGetir()
    .then(gelenVeriler => {
        result.tablo1 = calculate1()
        result.info = veriler.data_1[1]
        result.tablo2 = calculate2()
        console.log(result)
        res.json(result);
    }) 

});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} üzerinde başarılı bir şekilde paylaşıldı!`);
});
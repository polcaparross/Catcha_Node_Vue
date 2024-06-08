//== Backend =================================================================

const convolutedCryptoProvider = function (seed) {
  return new Promise(function (resolve, reject) {
    resolve({
      boolean: seed % 2 == 0,
      next: () => convolutedCryptoProvider((seed * 13 + 1) % 25),
    });
  });
};

// TODO

const getBooleanList = function (seed) {
  return new Promise((resolve, reject) => {
    let result = [];
    let f1 = convolutedCryptoProvider(seed);
    f1.then((res1) => {
      result.push(res1.boolean);
      let f2 = res1.next();
      f2.then((res2) => {
        result.push(res2.boolean);
        let f3 = res2.next();
        f3.then((res3) => {
          result.push(res3.boolean);
          let f4 = res3.next();
          f4.then((res4) => {
            result.push(res4.boolean);
            let f5 = res4.next();
            f5.then((res5) => {
              result.push(res5.boolean);
              let f6 = res5.next();
              f6.then((res6) => {
                result.push(res6.boolean);
                let f7 = res6.next();
                f7.then((res7) => {
                  result.push(res7.boolean);
                  let f8 = res7.next();
                  f8.then((res8) => {
                    result.push(res8.boolean);
                    let f9 = res8.next();
                    f9.then((res9) => {
                      result.push(res9.boolean);
                      resolve(result);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

const Catcha = function (challenge) {
  let list = getBooleanList(challenge).then((res) => res);
  this.getImages = function () {
    let finalList = new Array(list.length);
      return new Promise((resolve, reject) => {
        list.then((res)=>{
          let catIndex = 1;
          let bikeIndex = 1;
          
          res.forEach((el, index) => {
            if (el) {
              finalList[index] = `/public/img/cat${catIndex}.png`;
              catIndex++;
            } else {
              finalList[index] = `/public/img/bike${bikeIndex}.png`;
              bikeIndex++;
            }
          });
        })
        .finally(() =>{
          resolve(finalList);
        })
    });
  };

  this.checkAnswer = function (listR) {
    return new Promise((resolve, reject) => {
      Promise.all([list]).then((res) => {
      let counter = 0;
      for (let i = 0; i < listR.length; i++) {
        if (res[0][i] == listR[i]) {
          counter++;
        }
      }
      if (counter == listR.length) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    });
  };
};

// == Some Tests You May Want To Use =========================================

// getBooleanList(7).then(x => console.log(x));

/* 
const c = new Catcha(7);
c.getImages().then(x => console.log(x));
c.checkAnswer([ false, false, true, true, 
	false, false, true, true, false ]).then(x => console.log(x));
*/

/*
for (let i = 0; i < 13; i++) {
  new Catcha(i).getImages().then(list => console.log(i + " " + list))
}
*/

//== Web Server ==============================================================

import express from "express";
import path from "path";
import cors from "cors";
import { resolve4 } from "dns/promises";

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/challenge", function (req, res) {
  const challenge = Math.floor(Math.random() * 13);
  const catcha = new Catcha(challenge);

  catcha.getImages().then((images) => {
    res.json({ challenge: challenge, images: images });
  });
  /* } else {
    // Fallback
    res.json({ challenge: 'TODO', images:
      ['img/cat1.png','img/cat1.png','img/bike1.png',
      'img/bike1.png','img/bike1.png','img/bike1.png',
      'img/bike1.png','img/bike1.png','img/bike1.png']
    });
  } */
});

app.post("/response/:challenge", function (req, res) {
  const catcha = new Catcha(req.params.challenge);
  const selected = req.body["selected"];

  catcha
    .checkAnswer(selected)
    .then((boolean) => res.end(boolean ? "PASS" : "FAIL"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

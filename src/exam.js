//== Backend =================================================================

const convolutedCryptoProvider = function(seed) {
  return new Promise(function(resolve, reject) {
    resolve({
        boolean: seed % 2 == 0,
        next: () => convolutedCryptoProvider((seed * 13 + 1) % 25)
      });
  });
}

// TODO

const Catcha = function(challenge){

  let images = new Array(9)

  let generated = convolutedCryptoProvider(challenge)

  let calcArray = () => {
    return new Promise((resolve, reject) => {
      generated.then((res) => {
        images[0] = res.boolean;

        res.next().then((res2) => {
          images[1] = res2.boolean;

          res2.next().then((res3) => {
            images[2] = res3.boolean;

            res3.next().then((res4) => {
              images[3] = res4.boolean;

              res4.next().then((res5) => {
                images[4] = res5.boolean;

                res5.next().then((res6) => {
                  images[5] = res6.boolean;

                  res6.next().then((res7) => {
                    images[6] = res7.boolean;

                    res7.next().then((res8) => {
                      images[7] = res8.boolean;

                      res8.next().then((res9) => {
                        images[8] = res9.boolean;
                        resolve();
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

  this.getImages = () =>{
    return new Promise((resolve, reject) => {
      calcArray().then(() => {
        let catsIndex = 0;
        let bikesIndex = 0;
        let finalImages = images.map((el) => {
          if (el == true) {
            catsIndex++;
            return `/public/img/cat${catsIndex}.png`;
          } else {
            bikesIndex++;
            return `/public/img/bike${bikesIndex}.png`;
          }
        });
        resolve(finalImages);
      });
    });
  }

  this.checkAnswer = (selected) => {
    return new Promise((resolve, reject) => {
      calcArray().then(() => {
        let result = true;
        if (images.length == selected.length) {
          images.forEach((el, index) => {
            if (el != selected[index]) {
              result = false;
            }
          });
          resolve(result);
        }
      });
    });
  };
}



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

import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/challenge', function(req, res) {

  const challenge = Math.floor(Math.random() * 13);
  const catcha = new Catcha(challenge);

  catcha.getImages().then(images => {
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

app.post('/response/:challenge', function(req, res) {
  const catcha = new Catcha(req.params.challenge);
  const selected = req.body["selected"];

  catcha.checkAnswer(selected)
    .then(boolean => res.end(boolean ? "PASS": "FAIL"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`))

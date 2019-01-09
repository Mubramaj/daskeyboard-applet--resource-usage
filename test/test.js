const assert = require('assert');
const t = require('../index');

describe('RamUsage', function () {
  let app = new t.RamUsage();

  it('#getRamUsage', function () {
    app.getRamUsage().then(percent => {
      console.log("RAM Usage is: " + percent);
      assert.ok(percent);
    })
  });


  it('#generateColor', function () {
    const testLight = function (percent) {
      const points = app.generateColor(percent);
      return points[0].color;
    }

    const assertLight = function (percent, expected) {
      const actual = testLight(percent);
      const message = `For RAM usage ${percent}, I have a ${actual} light `
        + `(expected ${expected})`;  
      assert(expected === actual, message);
    }

    assertLight(20, '#00FF00');
    assertLight(30, '#33FF00');
    assertLight(69, '#FFFF00');
    assertLight(73, '#FF6600');
    assertLight(84, '#FF6600');
    assertLight(90, '#FF0000');
    assertLight(100, '#FF0000');


  });

  it('#run()', function () {
    app.run().then((signal) => {
      console.log(JSON.stringify(signal));
      assert.ok(signal);
    }).catch(error => {
      assert.fail(error);
    });
  });
})
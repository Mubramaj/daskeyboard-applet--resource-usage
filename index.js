// Library to track resources
const si = require('systeminformation');
// Library to track cpuUsage
const os = require('os-utils');
// Library to send signal to Q keyboards
const q = require('daskeyboard-applet');

// Color associated to the resource activity from low (green), middle (yellow), to high (red).
const colors = ['#00FF00', '#58FF00', '#8DFF00', '#C2FF00', '#F5FF00', '#FFFF00', '#FFE400', '#FFC100', '#FF8C00', '#FF0000'];

const logger = q.logger;


class ResourceUsage extends q.DesktopApp {
  constructor() {
    super();
    this.pollingInterval = 3000; // run() every 3000 ms
    logger.info("Resource Usage ready to go!");
  }

  // call this function every pollingInterval
  async run() {
    return this.getCpuUsage().then(async cpuUsage => {
      return this.getRamUsage().then(async ramUsage => {
        return this.getDiskUsage().then(async diskUsage => {
          return this.getNetworkUsage().then(async networkUsage => {
            // return signal each 3000ms, it depends of percent value
            return new q.Signal({
              points: [this.generatePoints(cpuUsage, ramUsage, diskUsage, networkUsage)],
              name: "Resource Usage",
              message: "CPU Usage: "+cpuUsage+"%"+"\n"+"RAM Usage: "+ramUsage+"%"+"\n"+"Disk Usage: "+diskUsage+"%"+"\n"+"Network Usage: "+networkUsage+"%",
              isMuted: true, // don't flash the Q button on each signal
            });
          });
        });
      });
    });
  }

  async getRamUsage() {
    return new Promise((resolve) => {
      si.mem(cb => {
        var ramUsage = Math.round((cb.active / cb.total) * 100);
        resolve(ramUsage);
      });
    })
  }

  async getCpuUsage() {
    return new Promise((resolve) => {
      os.cpuUsage(v => {
        let cpuUsage = Math.round(v * 100);
        resolve(cpuUsage);
      });
    })
  }

  async getDiskUsage() {
    return new Promise((resolve) => {
      si.fsStats(cb1 => {
        si.blockDevices(cb2 => {
          // TODO
          // Check WIN compatibility cb1 tx
          var diskUsage = Number(Number((cb1.tx/cb2[0].size)*100).toFixed(2));
          resolve(diskUsage);
        });
      });
    })
  }

  async getNetworkUsage() {
    return new Promise((resolve) => {
      si.networkInterfaces(cb1 => {
        si.networkStats(cb2 => {
          var i;
          for (i = 0; i < cb1.length; i++) { 
            if(cb1[i].iface==cb2[0].iface){
              // Get maxSpeed MBit/s converted to Bit/s
              var maxSpeed = (cb1[1].speed)*1000000; 
              // Get currentSpeed Bit/s
              var currentSpeed = cb2[0].rx_sec + cb2[0].tx_sec; 
              var networkUsage = Number((currentSpeed/maxSpeed)*100).toFixed(2);
            }
          }
          resolve(networkUsage);
        });        
      });
    })
  }

  generatePoints(firstValue, secondValue, thirdValue, fourthValue) {
    let points = [];
    points.push(new q.Point(this.generateColor(firstValue)));
    points.push(new q.Point(this.generateColor(secondValue)));
    points.push(new q.Point(this.generateColor(thirdValue)));
    points.push(new q.Point(this.generateColor(fourthValue)));
    return points;
  }

  generateColor(percent) {
    let color;
    switch (true) {

      case percent <= 10:
        // return first color
        color = colors[0];
        break;

      case percent <= 20:
        // return second color
        color = colors[1];
        break;

      case percent <= 30:
        // return third color
        color = colors[2];
        break;

      case percent <= 40:
        // return fourth color
        color = colors[3];
        break;

      case percent <= 50:
        // return fifth color
        color = colors[4];
        break;

      case percent <= 60:
        // return sixth color
        color = colors[5];
        break;

      case percent <= 70:
        // return seventh color
        color = colors[6];
        break;

      case percent <= 80:
        // return eighth color
        color = colors[7];
        break;

      case percent <= 90:
        // return ninth color
        color = colors[8];
        break;

      case percent <= 100:
        // return tenth color
        color = colors[9];
        break;

      default:
        // Something wrong happened, percent>100, return white color
        color = "#FFFFFF";
        break;

    };
    return color;
  }

}

module.exports = {
  ResourceUsage: ResourceUsage
};

const resourceUsage = new ResourceUsage();

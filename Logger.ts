import * as fs from 'fs';

/**
 * @From dice de que archivo viene
 * @debug recibe varios parametros escribe en un archivo de texto y lo logea en la consola
 * @stream regresa el txt escrito
 */

/**
 * @WARN necesariamente crear endpoint donde liste el texto escrito en los archivos
 */

class Logger {
  private from: String;
  private name: any;
  private hour: String

  constructor(from: string = "default", date = "") {
    this.from = from
    this.configure()
    this.hour = this.GetUTC()
    this.name = `logs/${date === "" ? this.hour.split(' ')[0] : date}.log`
  }

  configure() {
    fs.mkdir("logs", { recursive: true }, (error) => {
      if (error) {
        // console.error('Ocurrió un error al crear la carpeta:', error);
      } else {
        // console.log('¡La carpeta se ha creado correctamente!');
      }
    });
  }

  debug(...content: any[]) {

    var message: any

    try {
      let messages: any
      messages = content.map((msg, k) => {
        var msgs = ""
        switch (typeof (msg)) {
          case 'string':
            msgs = `${msgs} ${String(msg)}`
            break
          case 'object':
            msgs = `${msgs} ${JSON.stringify(msg)}`
            break
          default:
            msg.push(`No pudimos reconocer el tipo ${typeof (msg)} en codigo ${k}`)
        }
        const result = msgs
        return result.toString()
      })

      message = `${this.GetUTC()} :: ${String(messages)} :: ${this.from}`
    } catch (_) {
      message = `${this.GetUTC()} :: No pudimos capturar el log :: ${this.from}`
    }
    let data = `${String(message)}\n`
    fs.appendFile(this.name, data, (error) => {
      if (error) {
        // console.error('Ocurrió un error al escribir el archivo:', error);
      } else {
        // console.log('¡El archivo se ha escrito correctamente!');
      }
    });

    console.warn(content)
  }

  stream(): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(this.name, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  GetUTC() {
    let date_full: any = new Date().toISOString();
    let time_full = date_full.split('.')[0]
    let time = time_full
    // convert to GTM+6
    let now = new Date(time)
    let sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));


    let dia = sixHoursAgo.getDate().toString().padStart(2, '0');
    let mes = (sixHoursAgo.getMonth() + 1).toString().padStart(2, '0');
    let anio = sixHoursAgo.getFullYear();
    let hour = sixHoursAgo.getHours().toString().padStart(2, '0');
    let minute = sixHoursAgo.getMinutes().toString().padStart(2, '0');
    let second = sixHoursAgo.getSeconds().toString().padStart(2, '0');

    let fechaFormateada = `${anio}-${mes}-${dia} ${hour}:${minute}:${second}`;

    return fechaFormateada
  }
}

export {
  Logger
}


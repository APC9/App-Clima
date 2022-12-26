import fs from 'fs';
import axios from 'axios';
import internal from 'stream';

class Busqueda{
    historial=[];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB()
    }

    get historialCapitalizado(){
        return this.historial.map(item =>{

            let palabras = item.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ')
        })
    }

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    async ciudades(lugar =''){
        
        try {
            // peticion http
            
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });
    
            const resp = await intance.get();
            return resp.data.features.map(lugar =>({
                id: lugar.id,
                name: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
    }

    async climaLugar (lat, lon){
        try {
            const intance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{
                    lat,
                    lon,
                    appid: process.env.OPENWEATHER_KEY,
                    units: 'metric',
                    lang: 'es'
                }
            });

            const resp = await intance.get();
            const {weather, main} = resp.data;
            return {
                desc: weather[0].description,
                temp: main.temp,
                max: main.temp_max,
                min: main.temp_min
            }

        } catch (error) {
            return error;
        }
    }

    agregarHistorial(lugar =''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar historial
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial : this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)){
            return null
        }else{
            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8'}) 
            const data = JSON.parse(info);
    
            this.historial = [...data.historial];
            return this.historial;
        }
    
    }

}



export{
    Busqueda
}
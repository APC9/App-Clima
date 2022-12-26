import colors from 'colors';
import dotenv from 'dotenv'
import { inquirerMenu, leerInput, listarLugares, pausa } from './helpers/inquirer.js';
import { Busqueda } from './models/busqueda.js';

dotenv.config()


const main = async () =>{

    const busqueda = new Busqueda();
    let opt;

    do{
        opt =  await inquirerMenu()
        
        switch(opt){

            case '1':
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ')

                // Buscar lugares
                const lugares = await busqueda.ciudades(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares)
                if(id === '0') continue;
                const lugarSelecionado = lugares.find(lugar => lugar.id === id );

                //Guardar en DB
                busqueda.agregarHistorial(lugarSelecionado.name);

                //Clima
                const clima = await busqueda.climaLugar(lugarSelecionado.lat, lugarSelecionado.long);
    
                //Mostrar resultados
                console.clear()
                console.log('\nInformacion de la Ciudad\n'.green);
                console.log('Ciudad: '.yellow + lugarSelecionado.name);
                console.log('LAT: '.yellow + lugarSelecionado.lat);
                console.log('LONG: '.yellow + lugarSelecionado.long);
                console.log('Descripcion: '.yellow + clima.desc);
                console.log('Temperaturas: '.yellow +  clima.temp,'°C');
                console.log('Maxima: '.yellow +clima.max,'°C'); 
                console.log('Minima: '.yellow + clima.min,'°C');

                break;

            case '2':
                //busqueda.historial.forEach((lugar,i )=>{
                busqueda.historialCapitalizado.forEach((lugar,i )=>{
                    const idx= `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })

                break;

        }

        if (opt !== '0') await pausa();

    }while(opt !=='0')
}

main()
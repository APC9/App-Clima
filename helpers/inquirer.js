import inquirer from "inquirer";
import  colors  from 'colors';

const preguntas = [{
    type: 'list',
    name: 'opcion',
    massage: '¿Que desea hacer?',
    choices: [
        {
            value: '1',
            name: `${'1'.red}. Buscar ciudad`
        },
        {
            value: '2',
            name: `${'2'.red}. Historial`
        },
        {
            value: '0',
            name: `${'0'.red}. Salir`
        }
    ]
}];


const pausa = async () => {

    const enter = [{
        type: 'input',
        name: `\nPresione ${'ENTER'.blue} para continuar \n`,
    }]

    await inquirer.prompt(enter);
}

const inquirerMenu = async () => {

    console.clear();
    console.log('=============================='.green);
    console.log('    Seleccione una opción     '.yellow)
    console.log('============================== \n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length ===0){
                return 'Por favor ingrese un valor valido'
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}


const listarLugares = async(lugares = [])=>{
    const choices = lugares.map((lugar, i )=>{
        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.name}` 
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Lugar',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
}

export{
    inquirerMenu,
    pausa, 
    leerInput,
    listarLugares
}
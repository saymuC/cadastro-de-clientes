import inquirer from "inquirer";
import readline from "readline-sync";
import chalk from "chalk";
import fs from "fs";

const menu = [
    'Cadastar Cliente',
    'Listar todos os clientes',
    'buscar cliente por nome', 
    'Remover cliente',
    'Sair'
];

const user = readline.question("Digite seu nome: ");
console.log(`Olá ${user}, Bem vindo ao sistemas!`);

function Menus() {
    inquirer
        .prompt([
            {
            name: 'menu',
            type: 'list',
            message: 'Escolha uma opção: ',
            }
    ])
    .then((answers) => {
        switch (answers.menu) {
            case "Criar um novo arquivo":
                createFile();
                break;
            case "Ler um arquivo":
                readFile();
                break;
            case "Sair":
                console.log(chalk.italic.white("Saindo..."));
                break;
            default:
                console.log(chalk.red("Opção inválida!"));
                Menus();
        }
    })
};
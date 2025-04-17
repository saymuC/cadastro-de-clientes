import inquirer from "inquirer";
import readline from "readline-sync";
import chalk from "chalk";
import fs from "fs";

const MENU = [
    'Cadastar Cliente',
    'Listar todos os clientes',
    'buscar cliente por nome', 
    'Remover cliente',
    'Sair'
];

let cliente = [];

const user = readline.question("Digite seu nome: ");
console.log(`Olá ${user}, Bem vindo ao sistemas!`);

function carregarDados(nomeArquivo) {
  if (fs.existsSync(nomeArquivo)) {
    const dados = fs.readFileSync(nomeArquivo, 'utf8');
    return dados.trim() ? JSON.parse(dados) : [];
  }
  return [];
}

function salvarDados(nomeArquivo, novosDados) {
  const dadosAtuais = carregarDados(nomeArquivo);
  const dadosAtualizados = [...dadosAtuais, ...novosDados];

  fs.writeFileSync(nomeArquivo, JSON.stringify(dadosAtualizados, null, 2), 'utf8');
}


function Menus() {
    inquirer
        .prompt([
            {
            name: 'menu',
            type: 'list',
            message: "Escolha uma opção: ",
            choices: MENU,
            }
    ])
    .then((answers) => {
        switch (answers.menu) {
            case "Cadastar Cliente":
                cadastrarCliente();
                break;
            case "Listar todos os clientes":
                listarClientes();
                break;
            case "buscar cliente por nome":
                buscarCliente();
                break;
            case "Remover cliente":
                removerCliente();
                break;
            case "Sair":
                console.log("Saindo...");
                break;
            default:
                console.log(chalk.red("Opção inválida!"));
                Menus();
        }
    })
    .catch((error) => {
        console.error(chalk.red('Ocorreu um erro:', error.message || error));
        Menus();
    });
};

let clientesExistentes1 = [];

function verificarECarregarJSON(caminhoArquivo) {
    if (fs.existsSync(caminhoArquivo)) {
      const conteudo = fs.readFileSync(caminhoArquivo, 'utf8').trim();
  
      if (conteudo !== '') {
        try {
            const dadus = JSON.parse(conteudo)
            console.log('Aqui esta todos os clientes:');
            console.log(JSON.stringify(dadus, null, 2));
          return Menus();
        } catch (erro) {
          console.log(chalk.red('❌ Erro ao interpretar o JSON:', erro.message));
          return Menus(); 
        }
      } else {
        console.log(chalk.red('⚠️ Arquivo existe, mas está vazio.'));
        return Menus();
      }
    } else {
      console.log(chalk.red('⚠️ Arquivo não encontrado.'));
      return Menus();
    }
  }

function cadastrarCliente() {
    console.log('===cadastro de clientes===');
    const nome_cliente = readline.question('Nome do Cliente: ').trim();
    if (nome_cliente === '') {
        console.log(chalk.red('O nome não pode ser vazio!'));
        return Menus();
    }
    const email_cliente = readline.questionEMail('Email do Cliente: ').trim();
    const numero_cliente = readline.questionInt('Numero do Cliente: ');
    if (email_cliente === '') {
        console.log(chalk.red('O email não pode ser vazio!'));
        Menus();
    }
    if (isNaN(numero_cliente) || numero_cliente <= 0) {
        console.log('Número inválido, digite um número válido!');
        Menus();
    }
    const clientesExistentes = carregarDados('clientes.json'); 
    clientesExistentes.push({
        Nome_Cliente: nome_cliente,
        Email_Cliente: email_cliente,
        Numero_Cliente: numero_cliente
    });
    salvarDados('clientes.json', clientesExistentes);
    console.log(chalk.green('Cliente cadastrado com sucesso!'))
    Menus();
}

function listarClientes() {
    console.log('===Clientes cadastrados===\n')
    verificarECarregarJSON('clientes.json')
};

Menus();
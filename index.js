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

function limpar() {
    console.clear();
}
limpar();

let cliente = [];

const user = readline.question("Digite seu nome: ");
limpar();
console.log(`Olá ${user}, Bem vindo ao sistema!`);

function carregarDados(nomeArquivo) {
  if (fs.existsSync(nomeArquivo)) {
    const dados = fs.readFileSync(nomeArquivo, 'utf8');
    return dados.trim() ? JSON.parse(dados) : [];
  }
  return [];
}
function salvarDados(nomeArquivo, dados) {
    fs.writeFileSync(nomeArquivo, JSON.stringify(dados, null, 2), 'utf8');
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
                limpar();0
                console.log("Saindo...");
                break;
            default:
                console.log(chalk.red("Opção inválida!"));
                Menus();
        }
    })
    .catch((error) => {
        limpar();
        console.error(chalk.red('Ocorreu um erro:', error.message || error));
        Menus();
    });
};

let clientesExistentes1 = [];

function verificarECarregarJSON(caminhoArquivo) {
    if (fs.existsSync(caminhoArquivo)) {
      const conteudo = fs.readFileSync(caminhoArquivo, 'utf8').trim();
  
      if (conteudo !== '' && conteudo !== '[]') {
        try {
            const dadus = JSON.parse(conteudo)
            console.log(JSON.stringify(dadus, null, 2));
          return Menus();
        } catch (erro) {
            limpar();
          console.log(chalk.red('Erro ao interpretar o JSON:', erro.message));
          return Menus(); 
        }
      } else {
        limpar();
        console.log(chalk.red('Arquivo existe, mas está vazio.\n'));
        return Menus();
      }
    } else {
        limpar();
      console.log(chalk.red('Arquivo não encontrado.\n'));
      return Menus();
    }
  }

function cadastrarCliente() {
    limpar();
    console.log('===cadastro de clientes===\n');
    const nome_cliente = readline.question('Nome do Cliente: ').trim();
    if (nome_cliente === '') {
        limpar();
        console.log(chalk.red('O nome não pode ser vazio!\n'));
        return Menus();
    }
    const email_cliente = readline.questionEMail('Email do Cliente: ').trim();
    const numero_cliente = readline.questionInt('Numero do Cliente: ');
    if (email_cliente === '') {
        limpar();
        console.log(chalk.red('O email não pode ser vazio!\n'));
        Menus();
    }
    if (isNaN(numero_cliente) || numero_cliente <= 0) {
        limpar();
        console.log('Número inválido, digite um número válido!\n');
        Menus();
    }
    const clientesExistentes = carregarDados('clientes.json'); 
    clientesExistentes.push({
        Nome_Cliente: nome_cliente,
        Email_Cliente: email_cliente,
        Numero_Cliente: numero_cliente
    });
    salvarDados('clientes.json', clientesExistentes);
    limpar();
    console.log(chalk.green('Cliente cadastrado com sucesso!\n'))
    Menus();
}

function listarClientes() {
    limpar();
    console.log('===Clientes cadastrados===\n')
    verificarECarregarJSON('clientes.json')
};

function buscarCliente() {
    limpar();
    console.log('===Buscar Clientes===\n');
    const buscar_nome = readline.question('Nome que deseja buscar: ').trim();

    let nomes_existentes = [];
    if (fs.existsSync('clientes.json')) {
        const dados = fs.readFileSync('clientes.json', 'utf8');
        if (dados.trim() !== '') {
            nomes_existentes = JSON.parse(dados);
        }
    }
    const nomes_filtrados = nomes_existentes.filter((CLIENTE) => 
        CLIENTE.Nome_Cliente.toLowerCase().includes(buscar_nome.toLowerCase())
    );

    if (buscar_nome === '') {
        limpar();
        console.log(chalk.red('Digite um nome válido.\n'));
        return Menus();
    } else if (nomes_filtrados.length === 0) {
        limpar();
        console.log(chalk.red(`Nenhum Cliente cadastrado com o nome ${buscar_nome}\n`));
    } else {
        limpar();
        console.log(chalk.green(`Clientes encontrados com o nome ${buscar_nome}: \n`));
    nomes_filtrados.forEach((CLIENTE, index) => {
        console.log(`${index + 1}. ${chalk.yellow(CLIENTE.Nome_Cliente)} \nEmail: ${CLIENTE.Email_Cliente} \nNúmero: ${CLIENTE.Numero_Cliente}\n`)
    });
    }
    Menus();

}

function removerCliente() {
    limpar();
    let clientesExistentes = carregarDados('clientes.json');
    console.log('=== Remover Clientes ===\n');

    if (clientesExistentes.length === 0) {
        console.log(chalk.red('Não há nenhum cliente cadastrado!\n'));
        return Menus();
    }

    inquirer
        .prompt([
            {
                name: 'indice',
                type: 'list',
                message: 'Escolha qual cliente deseja remover:',
                choices: clientesExistentes.map((cliente, index) => ({
                    name: `${cliente.Nome_Cliente} | ${cliente.Email_Cliente} | ${cliente.Numero_Cliente}`,
                    value: index
                })),
            }
        ])
        .then((answers) => {
            const removido = clientesExistentes.splice(answers.indice, 1);
            salvarDados('clientes.json', clientesExistentes);
            limpar();
            console.log(chalk.green(`Cliente removido com sucesso: ${removido[0].Nome_Cliente}\n`));
            Menus();
        })
        .catch((error) => {
            limpar();
            console.error(chalk.red('Ocorreu um erro:'), error.message || error);
            Menus();
        });
}


Menus();
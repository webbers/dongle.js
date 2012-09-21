dongle.js - A boosted util library
===================================
* Conjunto de funções úteis que são uma mão na roda no dia-a-dia do programador Javascript.

O que você precisa para compilar o dongle.js
--------------------------------------------
Usuários Windows:

1. Instalar o [msysgit](https://code.google.com/p/msysgit/) (não esquecer de colocar a pasta bin na variável de ambiente PATH);
2. Instalar o [Node.js](http://nodejs.org/).
3. Baixar o [PhantomJs](http://phantomjs.org/download.html), Descompactar em um diretório e inserir este diretório na variável de ambiente PATH

Como compilar o dongle.js
----------------------------

Primeiro faça um clone do repositório:

```bash
git clone https://github.com/webbers/dongle.js.git
```

Entre no diretório que foi clonado e instale as dependências do Node:

```bash
cd dongle.js
npm install
```

Tenha certeza que você tem o grunt instalado com o seguinte teste:

```bash
node_modules\.bin\grunt.cmd -version
```


Então para rodar o build completo do dongle.js digite o seguinte:

```bash
node_modules\.bin\grunt.cmd deploy
```

A versão compilada e minificada do dongle.js estarão no subdiretório `dist/`.
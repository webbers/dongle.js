dongle.js - A boosted util library
===================================
[![Build Status](https://secure.travis-ci.org/webbers/dongle.js.png)](http://travis-ci.org/webbers/dongle.js)

* Conjunto de funções úteis que são uma mão na roda no dia-a-dia do programador Javascript.

O que você precisa para compilar o dongle.js
--------------------------------------------
Usuários Windows:

1. Instalar o [msysgit](https://code.google.com/p/msysgit/) (não esquecer de colocar a pasta bin na variável de ambiente PATH);
2. Instalar o [Node.js](http://nodejs.org/).
3. Baixar o [PhantomJs](http://phantomjs.org/download.html), Descompactar em um diretório e inserir este diretório na variável de ambiente PATH
3. Baixar o [JsCoverage](http://siliconforks.com/jscoverage/download.html), Descompactar em um diretório e inserir este diretório na variável de ambiente PATH

Como compilar o dongle.js
----------------------------

Primeiro faça um clone do repositório:

```bash
git clone https://github.com/webbers/dongle.js.git
```

Entre na pasta dongle.js e execute o comnando para instalar as dependências:
```bash
cd dongle.js
npm install
```

Depois instale o grunt para que ele funcione através do path do windows:
```bash
npm install -g grunt
```

Tenha certeza que você tem o grunt instalado com o seguinte teste:

```bash
grunt.cmd -version 
```

Então para rodar o build completo do dongle.js digite o seguinte:

```bash
grunt.cmd
```

A versão compilada e minificada do dongle.js estarão no subdiretório `dist/`.

## Contributing

Please use the issue tracker and pull requests.

## License
Copyright (c) 2012 Webbers Team
Licensed under the MIT license.
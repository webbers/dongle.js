dongle.net - A boosted util library
===================================
* Conjunto de fun��es �teis que s�o uma m�o na roda no dia-a-dia do programador Javascript.

O que voc� precisa para compilar o dongle.js
--------------------------------------------
Usu�rios Windows:

1. Instalar o [msysgit](https://code.google.com/p/msysgit/) (n�o esquecer de colocar a pasta bin na vari�vel de ambiente PATH);
2. Instalar o [Node.js](http://nodejs.org/).

Como compilar o dongle.js
----------------------------

Primeiro fa�a um clone do reposit�rio:

```bash
git clone https://github.com/webbers/dongle.js.git
```

Entre no diret�rio que foi clonado e instale as depend�ncias do Node:

```bash
cd dongle.js
npm install
```

Tenha certeza que voc� tem o grunt instalado com o seguinte teste:

```bash
grunt.cmd -version
```


Ent�o para rodar o build completo do dongle.js digite o seguinte:

```bash
grunt.cmd deploy
```

A vers�o compilada e minificada do dongle.js estar�o no subdiret�rio `dist/`.
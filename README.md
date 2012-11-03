dongle.js - A boosted util library
===================================
[![Build Status](https://secure.travis-ci.org/webbers/dongle.js.png)](http://travis-ci.org/webbers/dongle.js)

* Features that are useful in handy on a day-to-day programmer Javascript.

What you need to compile the dongle.js
--------------------------------------
Windows users:

1. Install [msysgit](https://code.google.com/p/msysgit/) (register bin folder in PATH environment var);
2. Install [Node.js](http://nodejs.org/).
3. Download [PhantomJs](http://phantomjs.org/download.html), extract into a folder and register it in PATH
3. Download [JsCoverage](http://siliconforks.com/jscoverage/download.html), extract into a folder and register it in PATH

How to compile dongle.js
------------------------

First you need clone repo:

```bash
git clone https://github.com/webbers/dongle.js.git
```

Enter the directory and install the Node dependencies:
```bash
cd dongle.js
npm install
```

After install ``grunt`` as global:
```bash
npm install -g grunt
```

Make sure you have ``grunt`` installed by testing:

```bash
grunt.cmd -version 
```

Then, to get a complete version of `dongle.js`, type the following:

```bash
grunt.cmd
```

The built version and minified of `dongle.js` will be put in the `dist/` subdirectory.

## Contributing

Please use the issue tracker and pull requests.

## License
Copyright (c) 2012 Webbers Team
Licensed under the MIT license.
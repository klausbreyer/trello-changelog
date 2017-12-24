trello-changelog
===========

Simple script that generates a summary from a labelled Trello list. Very simple changelogs for agile sprints.


![Screenshot](https://github.com/klausbreyer/trello-changelog/raw/master/screenshot.png)

## Installation


You can install this executable using npm:

```bash
$ npm install trello-changelog -g
```

or yarn:

```bash
$ yarn add global trello-changelog
```

Please make sure, that you install it global. 


## Usage

Just run trello-changelog. 

```bash
$ trello-changelog
```

At the first start you will be asked for a trello app key and a trello user token. You do not need to enter them again when you restart the program. 

After that you will be asked for a board and a list of the board. As a result you get all cards of the selected list - grouped by labels. 

LICENSE
=======

The MIT License (MIT)

Copyright (c) 2017 Klaus Breyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
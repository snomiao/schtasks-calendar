#!/usr/bin/env node

// 
// Copyright © 2020 snomiao@gmail.com
// 
// this file is for compatiable to windows and linux and vscode run
// 
const main = require('./schtasks-calendar')

// RUN cli
if (require.main === module) main().then(console.info)
// .catch(console.error);
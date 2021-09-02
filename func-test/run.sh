#! /bin/sh 

# Functional tests runner

node_modules/.bin/pm2 -s start database.js
node_modules/.bin/pm2 -s start index.js

sleep 5

node_modules/.bin/jest ./func-test/

node_modules/.bin/pm2 -s stop index.js
node_modules/.bin/pm2 -s stop database.js

#!/usr/bin/env node

// maintainer note - x.y.z-ab version in package.json -> x.y.z
var version = require('./package').version.replace(/-.*/, '')

var fs = require('fs')
var os = require('os')
var path = require('path')
var extract = require('extract-zip')
var download = require('electron-download')

var installedVersion = null
try {
  installedVersion = fs.readFileSync(path.join(__dirname, 'dist', 'version'), 'utf-8').replace(/^v/, '')
} catch (err) {
  // do nothing
}

var platform = os.platform()

function onerror (err) {
  throw err
}

var paths = {
  darwin: 'dist/Electron.app/Contents/MacOS/Electron',
  freebsd: 'dist/electron',
  linux: 'dist/electron',
  win32: 'dist/electron.exe'
}

if (!paths[platform]) throw new Error('Unknown platform: ' + platform)

if (installedVersion === version && fs.existsSync(path.join(__dirname, paths[platform]))) {
  process.exit(0)
}

var china_Mirror='https://npm.taobao.org/mirrors/electron/';

// downloads if not cached
//download({mirror:china_Mirror,version: version, arch: process.env.npm_config_arch, strictSSL: process.env.npm_config_strict_ssl}, extractFile)
download({mirror:china_Mirror,version: version, arch: process.env.npm_config_arch, strictSSL: process.env.npm_config_strict_ssl}, extractFile)

// unzips and makes path.txt point at the correct executable
function extractFile (err, zipPath) {
  if (err) return onerror(err)
  fs.writeFile(path.join(__dirname, 'path.txt'), paths[platform], function (err) {
    if (err) return onerror(err)
    extract(zipPath, {dir: path.join(__dirname, 'dist')}, function (err) {
      if (err) return onerror(err)
    })
  })
}

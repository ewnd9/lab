// https://gist.github.com/substack/0177839f57e8fe0fc294

var wswarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var swarm = wswarm(signalhub(
  'swarmchat-example',
  ['https://signalhub.mafintosh.com']
))
var randombytes = require('randombytes')

var vdom = require('virtual-dom')
var h = vdom.h
var main = require('main-loop')
var loop = main({ lines: [] }, render, vdom)
document.querySelector('#content').appendChild(loop.target)

var split = require('split2')
var through = require('through2')
var onend = require('end-of-stream')

var streams = {}, seen = {}
swarm.on('peer', function (stream, id) {
  console.log('CONNECTED', id)
  streams[id] = stream
  onend(stream, function () { delete streams[id] })

  stream
    .pipe(split())
    .pipe(through(function (line, enc, next) {
      var parts = line.toString().split(',')
      var msg = parts.slice(1).join(',')
      var msgid = parts[0]
      if (addMsg(msgid, msg) === false) return next()
      Object.keys(streams).forEach(function (sid) {
        if (sid === id) return
        streams[id].write(line + '\n')
      })
      next()
    }))
})

function render (state) {
  return h('div', [
    h('div.lines', state.lines.map(function (line) {
      return h('pre', line)
    })),
    h('form', { onsubmit: chat }, [
      h('input', { type: 'text', name: 'msg' })
    ])
  ])
  function chat (ev) {
    ev.preventDefault()
    var msg = this.elements.msg.value
    var msgid = randombytes(8).toString('hex')
    Object.keys(streams).forEach(function (id) {
      streams[id].write(msgid + ',' + msg + '\n')
    })
    addMsg(msgid, msg)
    this.reset()
  }
}

function addMsg (msgid, msg) {
  if (seen[msgid]) return false
  seen[msgid] = true
  var lines = loop.state.lines
  lines.push(msg)
  loop.update({ lines: lines.slice(-10) }) // keep only the 10 most recent lines
}

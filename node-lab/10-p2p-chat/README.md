# p2p-chat

## Client - Server

```
$ node server
$ node client # write data to stdin
$ node client # write data to stdin
```

## P2P

```
$ node peer localhost:3000 localhost:3001 localhost:3002
$ node peer localhost:3001 localhost:3000 localhost:3002
$ node peer localhost:3002 localhost:3000 localhost:3001
```

## P2P half connected

```
$ node peer.js localhost:3000 localhost:3001
$ node peer.js localhost:3001 localhost:3002
$ node peer.js localhost:3002
```

## P2P multicast

```
$ node peer-multicast u1 u2
$ node peer-multicast u2 u1
```

## P2P distributed

```
$ node peer-distributed u1 u2
$ node peer-distributed u2 u1
```

## Resources

- https://opbeat.com/blog/posts/how-to-write-a-p2p-chat-application-by-mathias-buus/
- https://p2p-workshop.mafintosh.com/

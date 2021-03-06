const http = require('http').createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write('Hello World!');
	res.end();
})

const io = require('socket.io')(http);

io.on('connection', function (socket) {
	let currentRoomId;

	console.log(`User is Connected in`);

	socket.on('test', function () {
		try {
			socket.emit('testComplete', 'Cool Test')
		} catch (e) {
			socket.emit('testComplete', 'Test Error')
		}
	});

	socket.on('disconnecting', (reason) => {

		console.log('disconnecting -- > ', socket.id, reason)

	});

	socket.on('disconnect', function (reason) {
		try {
			console.log('disconnected  --> ', socket.id, reason);
			// socket.leave(currentRoomId);
			// // io.of('/').adapter.remoteDisconnect(socket.id, true);
			// socket.broadcast.in(currentRoomId).emit('disconnectComplete', socket.id)
		} catch (e) {

		}
	})

	socket.on('addUser', function (args) {
		const { roomId } = args;
		socket.join(roomId);
		currentRoomId = roomId;
		// socket.broadcast.in(currentRoomId).emit('connectionComplete', args)
	});

	socket.on('changeRoom', function (args) {
		const { roomId } = args;
		socket.leave(currentRoomId);
		socket.join(roomId);
		currentRoomId = roomId;
		socket.broadcast.in(currentRoomId).emit('connectionComplete', args)
	})

	socket.on('sendMessage', function (args) {
		const { roomId } = args;
		io.sockets.in(roomId).emit('sendMessageComplete', args)
	})
});

http.listen(process.env.port || 3100, function () {
	console.log(`listening on ${process.env.port || 3100}`);
});
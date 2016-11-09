'use strict';

var SocketSrv = require('./socket_srv');
var Room = require('./room');

var App = function (name, Id, port) {
    var _this = this;

    if (!name || !Id || !port) return false && callback && callback(new Error('name, Id, port cannot be null'));
    _this.server  = new SocketSrv(_this, (port || 8080));

    _this.Id = Id;
    _this.name = name;
    _this.port = port;

    _this.RoomMap = new Map();

    _this.createRoom = function (roomName, roomId, initData) {
        var roomIns = new Room(roomName, roomId, initData);
        _this.RoomMap.set(roomId, roomIns);
        return roomIns;
    }

    _this.removeRoom = function (roomId) {
        _this.RoomMap.get(roomId).clearRoom();
        _this.RoomMap.delete(roomId);
        return;
    }

    _this.clear = function () {
        _this.RoomMap.forEach(function (roomIns) {
            roomIns.clear();
        });
        return;
    }

    _this.receiveMsg = function (msg, conn) {
        if (!msg.gameId || !msg.roomId || !msg.clientId || !msg.info || !msg.type) return;

        var roomIns = _this.RoomMap.get(msg.roomId);
        switch (msg.type) {
            case 'init':
                roomIns.joinRoom(msg.clientId, conn);
                break;
            case 'info':
                roomIns.receiveMsg(msg);
            default:
        }
        return;
    }

    return _this;
}

module.exports = App;
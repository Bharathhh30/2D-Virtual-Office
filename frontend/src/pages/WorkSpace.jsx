import React, { useEffect, useState } from "react";
import { useFireBase } from "../context/FireBase";
import socket from "../socket/socket";

function WorkSpace() {
    const { user, handleSignOut } = useFireBase();
    const [users, setUsers] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [inputRoomId, setInputRoomId] = useState("");
    const [error, setError] = useState(null);

    if (!user) {
        return <div>Loading....</div>;
    }

    const userName = user.displayName || user.email.split("@")[0];

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("http://localhost:5000/rooms");
                const data = await response.json();
                setRooms(Object.entries(data).map(([id, room]) => ({ id, name: room.name })));
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();

        socket.on("connect", () => {
            console.log("Connected to WebSocket server");
            const storedRoomId = localStorage.getItem("joinedRoom");
            if (storedRoomId) {
                joinRoom(storedRoomId);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
            setJoinedRoom(null);
            setUsers([]);
        });

        socket.on("update-user-list", (updatedUsers) => {
            setUsers(updatedUsers);
        });

        socket.on("room-join-error", (errorMessage) => {
            setError(errorMessage);
            setJoinedRoom(null);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("update-user-list");
            socket.off("room-join-error");
        };
    }, []);

    const joinRoom = (roomId) => {
        setError(null);
        socket.emit("join-room", roomId, userName);
        setJoinedRoom(roomId);
        localStorage.setItem("joinedRoom", roomId);
    };

    const handleJoinRoom = () => {
        if (inputRoomId) {
            joinRoom(inputRoomId);
        } else {
            alert("Please enter a room id");
        }
    };

    const handleExitRoom = () => {
        localStorage.removeItem('joinedRoom');
        setJoinedRoom(null);
        setUsers([]);
        socket.emit('exit-room', joinedRoom); // Notify the server that the user has exited
    };

    return (
        <div className="flex flex-col">
            <div className="header flex justify-between p-3 text-3xl border-2 m-2">
                <div>WorkSpace</div>
                <button onClick={handleSignOut} className="cursor-pointer text-2xl">
                    Logout
                </button>
            </div>
            <div className="p-3 flex flex-col">
                <h2>Hello, {userName}!</h2>
                <p>You are Beerozgaaar</p>
                <p>Welcome to the Beerozgaar dashboard. Enjoy your workspaces here.</p>
                <h3>Available Rooms:</h3>
                <ul>
                    {rooms.map((room) => (
                        <li
                            key={room.id}
                            onClick={() => setInputRoomId(room.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {room.name} ({room.id})
                        </li>
                    ))}
                </ul>
                
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    className="p-2 border-2 w-96 rounded-md"
                />

                <button className="bg-amber-300 p-2 rounded-md w-24 mt-2 text-white" onClick={handleJoinRoom}>Join Room</button>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {joinedRoom && (
                    <div>
                        <p>Joined Room: {joinedRoom}</p>
                        <button onClick={handleExitRoom}>Exit Room</button>
                        <h3 className="mt-4 text-xl font-bold">Users in Workspace:</h3>
                        <ul>
                            {users.map((user, index) => (
                                <li key={user.socketId || index}>{user.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkSpace;
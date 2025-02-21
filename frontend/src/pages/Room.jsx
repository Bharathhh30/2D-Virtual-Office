import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import Game from "../components/Game";

function Room() {
    const { roomId } = useParams(); // Get roomId from URL
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!roomId) {
            setError("Invalid Room ID");
            return;
        }

        socket.emit("join-room", roomId);

        socket.on("update-user-list", (updatedUsers) => {
            setUsers(updatedUsers);
        });

        socket.on("room-join-error", (errorMessage) => {
            setError(errorMessage);
        });

        return () => {
            socket.emit("exit-room", roomId);
            socket.off("update-user-list");
            socket.off("room-join-error");
        };
    }, [roomId]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="room-container">
            <h1>Room: {roomId}</h1>
            <button  onClick={() => navigate("/workspace")} className="text-white bg-amber-300 rounded-md p-2 exit-button cursor-pointer">
                Exit Room
            </button>

            <div className="map-container">
                {/* TODO: Load and render the map here */}
                <h2>Map will be loaded here...</h2>
                <Game />
            </div>

            <div className="users-list">
                <h3>Users in Room:</h3>
                <ul>
                    {users.map((user) => (
                        <li key={user.socketId}>{user.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Room;

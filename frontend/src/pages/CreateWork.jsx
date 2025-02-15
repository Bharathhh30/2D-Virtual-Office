import React ,{useState}from 'react'
import { useFireBase } from '../context/FireBase'

function CreateWork() {
  const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState(null);

  const {user,handleSignOut} = useFireBase()
  if (!user){
    return <div>Loading....</div>
  }

  const handleCreateRoom = async () => {
    try {
        const response = await fetch('http://localhost:5000/create-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomName })
        });

        const data = await response.json();
        setRoomId(data.roomId);
        alert(`Room created with ID: ${data.roomId}`);
    } catch (error) {
        console.error("Error creating room:", error);
    }
};

  const userName = user.displayName || user.email.split('@')[0]
  return (
    <div className='flex flex-col'>
      <div className='header flex justify-between p-3 text-3xl border-2 m-2'>
        <div>CreateWork</div>
        <button onClick={handleSignOut} className='cursor-pointer text-2xl'>Logout</button>
      </div>
      <div className='p-3'>
        <h2>Hello,{userName}!</h2>
        <p>You are admin</p>
        <p>Welcome to the admin dashboard.  You can manage workspaces here.</p>
      </div>

      {/* room creations */}
      <div className='p-3 flex flex-col'>
        <input 
          className='border-2 p-2 m-2 w-48'
          type="text" 
          placeholder='Enter room name'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="bg-amber-300 p-2 rounded-md w-36 mt-2 ml-1.5 text-white" onClick={handleCreateRoom}>Create Room </button>
        {roomId && <p>Room Id: {roomId}</p>}
      </div>
    </div>
  )
}

export default CreateWork
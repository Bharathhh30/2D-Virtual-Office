import React from 'react'
import { useFireBase } from '../context/FireBase'
import { useNavigate } from 'react-router-dom';

function SelectRole() {

    const {handleRoleSelection,user,isLoading} = useFireBase()
    const [SelectRole,setSelectedRole] = React.useState('')
    const navigate = useNavigate()

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!user){
        return <div>Not Logged In</div>
    }

    const handleSelect = async()=>{
        if (SelectRole){
            await handleRoleSelection(SelectRole)
            if (SelectRole === 'admin'){
                navigate('/createworkspace')
            }else if(SelectRole === 'user'){
                navigate('/workspace')
            }
        }else{
            console.log('Select Role')
            alert('Select Role')
        }
    }

  return (
    <div>
            <h2>Select Your Role</h2>
            <select value={SelectRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="">Select</option>
                <option value="admin">Admin</option>
                <option value="user">Worker</option>
            </select>
            <button onClick={handleSelect}>Submit</button>
        </div>
  )
}

export default SelectRole
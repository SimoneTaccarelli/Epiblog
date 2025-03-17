import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";


const SidebarHome = () => {
    const{user} = useAuth();
    const [users, setUsers] = useState([]);

 const userList = () => {
   axios.get('http://localhost:4000/users')
   .then((response) => {
        setUsers(response.data);
     console.log(response.data);
   })
   .catch((error) => {
     console.log(error);
   });
 }

 return (
    <div>
      <h3>Users</h3>
      <ul>
         {users.map((user) => (
            <li key={user._id}>{user.firstName} {user.lastName}</li>
         ))}
      </ul>
    </div>
     );

}

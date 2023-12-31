import React, { useEffect } from 'react'
import { useState } from 'react'
import CustomEvents from '../components/CustomEvents'
import avatar from '../assets/avatar.png'
import { useFetcher } from 'react-router-dom'
import { useFirebase } from '../context/firebase'
const UserDashboard = () => {
   const [userEvents,setUserEvents]=useState()
   const firebase=useFirebase()
   useEffect(()=>{
     const fetchData=async()=>{
      await firebase.UserEvents().then((res)=>{
        setUserEvents(res)
      })
     }
     fetchData()
   },[])


  return (
    <>
    <h2></h2>
    <div className='row gap-4' style={{margin:'6%'}}>
        <div className="col-md-3 card user-info d-flex justify-content-center align-items-center" >
            <img src={avatar} style={{width:'50%',height:'40%'}}/>
            <div className='text-center justify-center mt-3'>
             <h6>Name:{firebase?.currentUser?.displayName}</h6>
            </div>
        </div>
       <div className="col-md-8 contest-history" >
            <CustomEvents events={userEvents} />
      </div>
    </div>
    </>
  )
}

export default UserDashboard

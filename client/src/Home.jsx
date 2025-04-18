import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
const Home = () => {
  
    const [tab , setTab ] = useState(1);
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const handleTab = (tab) => {
        setTab(tab);
    }

    const handleAddTask = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/new-task',{task})
        .then(res=>{
          setTask('')
          setTasks(res.data);
        });
    }

    useEffect(()=>{
      axios.get('http://localhost:5000/read-tasks')
      .then(res=>{
        setTasks(res.data);
      })
    },[])

    const [updateId,setUpdateId] = useState(null)
    const [updatedTask,setUpdatedTask] = useState('')
    const handleEdit = (id, task) => {
        setIsEdit(true)
        setTask(task)
        setUpdatedTask(task);
        setUpdateId(id);
        
    }
  
    const updateTask = () => {
      axios.post('http://localhost:5000/update-task',{updateId,updatedTask})
      .then(res => {
        setTasks(res.data)
        setTask('')
      })
    }

    const handleDelete = (id) => {
      axios.post('http://localhost:5000/delete-task', {id})
      .then(res => {
        setTasks(res.data)
      })
    }

    const handleComplete = (id) =>{
      axios.post('http://localhost:5000/complete-task', {id})
      .then(res=>{
        setTasks(res.data)
      })
    }

    return (
    <div className='bg-gray-100 w-screen h-screen'>
        <div className='flex flex-col w-screen h-screen justify-center items-center'>

          <div>
             <h2 className='font-bold text-2xl mb-4'>Todo List</h2>
          </div>
          <div className='flex gap-3'>
             <input value={task} onChange={e => setTask(e.target.value)} type="text" placeholder='enter task'className='p-2 outline-none border border-blue-300 rounded-md w-64'/>
             <button onClick={handleAddTask} className='bg-blue-600 text-white px-4 rounded-md'>{isEdit ? <button onClick={updateTask}>Update</button> : <button onClick={handleAddTask}>Add</button>}</button>
          </div>

          <div className='flex text-sm w-80 justify-evenly mt-4'>
            <p onClick={()=> handleTab(1)} className={`${tab === 1 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>All</p>
            <p onClick={()=> handleTab(2)} className={`${tab === 2 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Active</p>
            <p onClick={()=> handleTab(3)} className={`${tab === 3 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Completed</p>
          </div>

           {
              tab == 1 && tasks?.map(todo => (
              <div className='flex justify-between bg-white p-2 w-80 mt-3 rounded-md'>
              <div>
                  <p className='text-lg font-semibold'>{todo.task}</p>
                  <p className='text-xs text-gray-600'>{new Date(todo.createdAt).toLocaleString()}</p>
                  <p className='text-sm text-gray-700'>Status: {todo.status}</p>
              </div>

              <div className='flex flex-col text-sm justify-start items-start'>
                  <button className='text-blue-600 cursor-pointer' onClick={()=>handleEdit(todo.id,todo.task)}>Edit</button>
                  <button className='text-red-500 cursor-pointer' onClick={()=> handleDelete(todo.id)}>Delete</button>
                  <button className='text-green-600 cursor-pointer' onClick={()=> handleComplete(todo.id)}>Complete</button>
              </div>
            </div>
            ))
           }


            {
              tab == 2 && tasks?.filter(todo => todo.status == 'active').map(todo => (
              <div className='flex justify-between bg-white p-2 w-80 mt-3 rounded-md'>
              <div>
                  <p className='text-lg font-semibold'>{todo.task}</p>
                  <p className='text-xs text-gray-600'>{new Date(todo.createdAt).toLocaleString()}</p>
                  <p className='text-sm text-gray-700'>Status: {todo.status}</p>
              </div>

              <div className='flex flex-col text-sm justify-start items-start'>
                  <button className='text-blue-600 cursor-pointer' onClick={()=>handleEdit(todo.id,todo.task)}>Edit</button>
                  <button className='text-red-500 cursor-pointer' onClick={()=> handleDelete(todo.id)}>Delete</button>
                  <button className='text-green-600 cursor-pointer' onClick={()=> handleComplete(todo.id)}>Complete</button>
              </div>
            </div>
            ))
           }

            {
              tab == 3 && tasks?.filter(todo => todo.status == 'completed').map(todo => (
              <div className='flex justify-between bg-white p-2 w-80 mt-3 rounded-md'>
              <div>
                  <p className='text-lg font-semibold'>{todo.task}</p>
                  <p className='text-xs text-gray-600'>{new Date(todo.createdAt).toLocaleString()}</p>
                  <p className='text-sm text-gray-700'>Status: {todo.status}</p>
              </div>

              <div className='flex flex-col text-sm justify-start items-start'>
                  <button className='text-red-500 cursor-pointer' onClick={()=> handleDelete(todo.id)}>Delete</button>
              </div>
            </div>
            ))
           }
           

        </div>
    </div>
  )
}



export default Home

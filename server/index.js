const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2')

app.use(express.json());
app.use(cors())

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'sys'
})

db.connect((err)=>{
    if(!err){
        console.log('connected to database')
    }else{
        console.log('failed to connect to database: ',err)
    }
})

app.post('/new-task',(req,res)=>{
    console.log(req.body);
    const q = 'insert into todos (task, createdAt, status) values (?,?,?)';
    db.query(q,[req.body.task, new Date(),'active'], (err,result)=>{
        if(err){        
            console.log("failed to add task");
        }else{
            console.log("task added");
            const updatedTasks = 'select * from todos'
            db.query(updatedTasks,(err,newList)=>{
                res.send(newList)
            })
        }
    })
})

app.get('/read-tasks',(req,res)=>{
    db.query('select * from todos',(err,result)=>{
        if(err){
            console.log("failed to read tasks");
        }else{
            res.send(result);
        }
    })
})

app.post('/update-task',(req, res)=>{
    const q = 'update todos set task = ? where id = ?'
    db.query(q,[req.body.task, req.body.updateId],(err, result)=>{
        if(err)
        {
            console.log('failed to update');
        }
        else
        {
            console.log('updated task')
            db.query('select * from todos',(e,r)=>{
                if(e){
                    console.log(e)
                }
                else{
                    res.send(r)
                }
            })
        }
    })
})

app.post('/delete-task',(req, res)=>{
    const q = 'delete from todos where id = ?'
    db.query(q, [req.body.id], (err, result)=> {
        if(err){
            console.log('failed to dekete')
        }
        else{
            console.log('Deleted successfully')
            db.query('select * from todos', (e, newList)=> {
                res.send(newList);
            })
        }
    })
})

app.post('/complete-task', (req,res)=>{
    const q = 'update todos set status = ? where id = ?'
    db.query(q,['completed', req.body.id],(err,result)=>{
        if(result){
            db.query('select * from todos',(e,newList)=>{
                res.send(newList)
            })
        }
    })
})


app.listen(5000,()=>{
    console.log('server started on port 5000')
})
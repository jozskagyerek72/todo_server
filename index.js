import express from "express"
import cors from "cors"
import mysql from "mysql2/promise"
import { configDB } from "./configDB.js"

const PORT = 3000
let connection
try {
    connection = await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
}

const app = express()
app.use(express.json())
app.use(cors())


//async mer kulso database?
app.get("/todos", async (req, res) => {
    try {
        const sql = "select * from todos order by timestamp"
        const [rows, fields] = await connection.execute(sql) //response a servertol
        res.send(rows)
    } catch (error) {
        console.log(error);

    }
})

//post de most sql paracsokkal mert tavoli databaseben dolgozunk
app.post("/todos",async (req,res) => 
{   
    const {task} = req.body
    if(!task) return res.json({msg:"hianyzo adat"})
    try {
        const sql ="insert into todos (task) values (?)"
        const values = [task]
        const [rows, fields] = await connection.execute(sql,values) 
        res.json({msg:"sikeres hozzáadás"})
    } catch (error) {
        console.log(error);
        
    }
})

app.delete("/todos/:id", async (req,res)=>
{
    const {id} = req.params
    try {
        const sql = "delete from todos where id=?"
        const values = [id]
        const [rows, fields] = await connection.execute(sql,values)
        res.json({msg:"sikeres torles"})
        console.log(rows,fields);
        
    } catch (error) {
        console.log(error);
        
    }
})

//update todos
app.put("/todos/completed/:id", async (req,res) => 
{
    const {id} = req.params
    

    try {
        const sql = "update todos set completed=NOT completed where id=(?)"
        const values = [id]
        
        const [rows, fields] = await connection.execute(sql,values)
        
        res.json({msg:"siker"})
    } catch (error) {
        console.log(error);
        
    }
})

app.put("/todos/:id", async (req,res) => 
    {
        const {id} = req.params
        const {task} = req.body
    
        try {
            const sql = "update todos set task=(?) where id=(?)"
            const values = [task,id]
            
            const [rows, fields] = await connection.execute(sql,values)
            
            res.json({msg:"siker"})
        } catch (error) {
            console.log(error);
            
        }
    })

app.listen(PORT, () => console.log("server live on port 3000"))
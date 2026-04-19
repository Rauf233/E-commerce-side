const app = require("./SRC/app")
const connectdb = require("./SRC/database/database")
app.listen(5000 , ()=>{
    console.log("Server is running");
})
connectdb()
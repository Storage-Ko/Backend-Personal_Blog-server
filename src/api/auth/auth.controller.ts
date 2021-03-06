import dotenv from "dotenv";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";
dotenv.config();

export const confirmName = (async(name, email) => {
    console.log(name, email);
    let result;
    try{
        result = await getConnection().getRepository(User).createQueryBuilder()
        .where("user.name = :name", {name: name})
        .getOne();
    } catch (e){
        console.log("Not Found same name");
    }
    if(result === undefined){
        try{
            result = await getConnection().getRepository(User).createQueryBuilder()
            .where("user.email = :email", {email: email})
            .getOne();
        } catch (e) {
            console.log("Not Found same email");
        }
    }
    console.log(result);
    return result;
});

export const signup = (async(ctx) => {
    const req = ctx.request.body;
    let body, status; 
    console.log(req); 
    const connection = await getConnection();
    const confirmObj = await confirmName(req.name, req.email);
    const TimeStamp = Date.now();
    const date = new Date(TimeStamp);
    const user = new User();
    if(req.name === "" || req.email === ""){
        status = 400;
        body = "Fill information";
    } else if(confirmObj) {
        status = 400;
        body = "You can't account";
    } else {
        user.name = req.name;
        user.email = req.email;
        user.password = req.password;
        status = 200;
        body = user;
        await connection.manager.save(user);
    }
    ctx.body = body;
    ctx.status = status;
});

export const login = (async(ctx) => {
    const req = ctx.request.body;
    console.log(req);
    ctx.body = req;
});

export const logout = (async(ctx) => {
    const req = ctx.request.body;
    console.log(req);
    ctx.body = req;
})
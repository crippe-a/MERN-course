import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {BadRequestError, UnAuthenticatedError} from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

const register = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        throw new BadRequestError("Please provide all values.");
    }
    const userAllreadyExist = await User.findOne({email});
    if(userAllreadyExist){
        throw new BadRequestError("Email already in use.")
    }
    const user = await User.create({name, email, password});
    const token = user.createJwt();
    attachCookies({res, token});
    res.status(StatusCodes.CREATED).json({ user:{email: user.email, lastName:user.lastName, location: user.location, name: user.name}, /*token,*/ location: user.location});

}

const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError("Please provide all values.");
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new UnAuthenticatedError("Invalid credentials.");
    }

    const isPassword = await user.comparePassword(password);
    if(!isPassword){
        throw new UnAuthenticatedError("Invalid credentials.");
    }

    const token = user.createJwt();
    user.password = undefined;

    
    res.status(StatusCodes.OK).json({user, /*token,*/ location: user.location})
}

const updateUser = async (req, res) => {
    const {email, name, lastName, location} = req.body;
    if(!email || !name || !lastName || !location){
        throw new BadRequestError("Please provide all values.");
    }

    const user = await User.findOne({_id: req.user.userId});

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    await user.save();
    const token = user.createJwt();
    attachCookies({res, token});

    res.status(StatusCodes.OK).json({user, /*token,*/ location: user.location});
}

const getCurrentUser = async (req, res)=>{
    const user = await User.findOne({_id:req.user.userId});
    res.status(StatusCodes.OK).json({user, /*token,*/ location: user.location});
}


export { register, login, updateUser, getCurrentUser }
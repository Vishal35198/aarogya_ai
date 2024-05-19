import mongoose from "mongoose";
import DoctorModel from "@/models/Doctor";
import dbConnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";


export async function GET(request:NextRequest) {
   
    const { email, password } = await request.json()

    dbConnect();

    try {

        const existingDoctor = await DoctorModel.findOne({
           $or: [
                {email: email},
                {phoneNumber: email}
           ]
        })
        
        console.log("existingDoctor: ", existingDoctor)

        if(!existingDoctor){
            return NextResponse.json({
                status: 400,
                message: "Doctor does not exist"
            },
            {
                status: 400,
            })
        }

        const isPasswordCorrect = await bcryptjs.compare(password, existingDoctor.password)
        console.log("isPasswordCorrect: ", isPasswordCorrect)

        if(!isPasswordCorrect){
            return NextResponse.json({
                status: 400,
                message: "Password is incorrect"
            },
            {
                status: 400,
            })
        }

        return NextResponse.json({
            status: 200,
            message: "Doctor signed in successfully",
            doctor: existingDoctor
        },
        {
            status: 200
        })
        
    } catch (error) {
        console.log("error in signing in: ", error)

        return NextResponse.json({
            status: 400,
            message: "An error occured while signing in",
            error: error
        },
        {
            status: 400
        })
    }
}
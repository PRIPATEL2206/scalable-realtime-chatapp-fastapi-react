import { NextRequest, NextResponse } from "next/server";
import { useEffect } from "react";

const protectedRoutes=["/chats"]
const publicRoutes=["/","/auth/login","/auth/register"]

export default function middleware(req:NextRequest){
    // if( protectedRoutes.includes(req.nextUrl.pathname)  ){
    //     const absUrl=new URL("/auth/login",req.nextUrl.origin)
    //     return NextResponse.redirect(absUrl.toString());
    // }

}
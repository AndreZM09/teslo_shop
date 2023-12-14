import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { InternalServerErrorException } from '@nestjs/common/exceptions';


export const RawHeaders=createParamDecorator(
    (data:string, ctx:ExecutionContext)=>{
        const req=ctx.switchToHttp().getRequest()
        return req.rawHeaders     
    }
)
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets/decorators';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MesssagesWsService } from './messsages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({cors: true})
export class MesssagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss:Server

  constructor(
    private readonly messsagesWsService: MesssagesWsService,
    private readonly jwtService:JwtService
    ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload:JwtPayload
    try {
      payload=this.jwtService.verify(token)
      await this.messsagesWsService.registerClient(client, payload.id)

    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({payload}); 
    
    
    // console.log('Cliente conectado', client.id);

    this.wss.emit('clients-updated', this.messsagesWsService.getConnectedClients())
    
  }

  handleDisconnect(client: Socket) {
    
    // console.log('Cliente desconectado', client.id);
    this.messsagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messsagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client:Socket, payload:NewMessageDto) {
    
    // client.emit('message-from-server',{
    //   fullName:'Soy Yo',
    //   message: payload.message || 'no message!!'
    // })

    // client.broadcast.emit('message-from-server',{
    //   fullName:'Soy Yo',
    //   message: payload.message || 'no message!!'
    // })

    this.wss.emit('message-from-server',{
      fullName:this.messsagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message!!'
    })
    
  }

}

# Tictaetoe
Frontend:
Langauage: TypeScript
Tool: React
Build Tool: Vite

Installation:
npm create vite@latest

Backend:
Language: Javascript
Tool: Express

Installation:
npm init
npm install express


Architecture and Design:

- Using WebSocket (Socket.io) for persistent connection.
- Clients are connected to the server and the server is connected to the clients via websockets for persistent connection.
- For other stateless connections, REST APIs can be used.

REST APIs:
Client -> (HTTP) -> Server 

WebSockets:
Client 1 -> (WebSocket) -> Server -> WebSocket -> Client 2

Deployment:
It was deployed on Render.
BE was deployed on Render Web service.
FE was deployed on Static site.
Render was linked to my git repository.
It picks code from git hub and start up build commands was given.

BE:
1. npm install
2. npm start

FE:
1. npm install
2. npm run dev
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HomeController {
  @Get()
  getHomePage(@Req() req: any, @Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chaishots CMS API</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      text-align: center;
    }
    .endpoint {
      background: #f8f9fa;
      border-left: 4px solid #007bff;
      padding: 10px;
      margin: 10px 0;
    }
    .auth-required {
      color: #dc3545;
      font-weight: bold;
    }
    .public {
      color: #28a745;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Chaishots CMS API</h1>
    <p>Welcome to the Chaishots Content Management System API. This API manages educational content in a hierarchical structure: Programs → Terms → Lessons.</p>
    
    <h2>Available Endpoints:</h2>
    
    <div class="endpoint">
      <strong>GET</strong> <code>/health</code> - <span class="public">Public</span> Health check endpoint
    </div>
    
    <h3>Authentication Endpoints:</h3>
    <div class="endpoint">
      <strong>POST</strong> <code>/auth/login</code> - <span class="public">Public</span> User login
    </div>
    <div class="endpoint">
      <strong>POST</strong> <code>/auth/register</code> - <span class="public">Public</span> User registration
    </div>
    <div class="endpoint">
      <strong>GET</strong> <code>/auth/profile</code> - <span class="auth-required">Auth Required</span> Get user profile
    </div>
    
    <h3>Management Endpoints (Admin/Editor access):</h3>
    <div class="endpoint">
      <strong>GET/POST</strong> <code>/programs</code> - Manage programs
    </div>
    <div class="endpoint">
      <strong>GET/POST</strong> <code>/terms</code> - Manage terms
    </div>
    <div class="endpoint">
      <strong>GET/POST</strong> <code>/lessons</code> - Manage lessons
    </div>
    <div class="endpoint">
      <strong>GET/POST</strong> <code>/topics</code> - Manage topics
    </div>
    <div class="endpoint">
      <strong>GET/POST</strong> <code>/assets</code> - Manage assets
    </div>
    
    <h3>Public Catalog API:</h3>
    <div class="endpoint">
      <strong>GET</strong> <code>/catalog/programs</code> - <span class="public">Public</span> Get published programs
    </div>
    <div class="endpoint">
      <strong>GET</strong> <code>/catalog/programs/:id</code> - <span class="public">Public</span> Get specific published program
    </div>
    <div class="endpoint">
      <strong>GET</strong> <code>/catalog/lessons/:id</code> - <span class="public">Public</span> Get specific published lesson
    </div>
    
    <h3>Documentation:</h3>
    <p>For detailed API documentation, please refer to the source code or contact the development team.</p>
  </div>
</body>
</html>
    `;
    
    res.send(html);
  }
}
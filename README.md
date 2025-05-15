# RealDiploma Chess Platform

A comprehensive chess education and gaming platform built with Node.js, React, and AI integration.

## Features

- Interactive chess gameplay against AI and real players
- Educational materials and tutorials
- Chess news section
- AI-powered chess bot for practice
- Real-time multiplayer functionality
- User authentication and progress tracking
- Extensible architecture for future Go and Checkers implementation

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Real-time Communication**: Socket.IO
- **AI/ML**: TensorFlow.js
- **Authentication**: JWT
- **Chess Logic**: chess.js

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/real-diploma.git
cd real-diploma
```

2. Install dependencies:
```bash
npm install
cd client && npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/chess_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Initialize the database:
```bash
npm run db:init
```

5. Start the development server:
```bash
npm run dev:full
```

## Project Structure

```
real-diploma/
├── client/                 # React frontend
├── src/
│   ├── server/            # Express backend
│   ├── models/            # Database models
│   ├── controllers/       # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── ai/                # AI model and training
│   └── utils/             # Helper functions
├── tests/                 # Test files
└── docs/                  # Documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
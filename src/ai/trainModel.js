const ChessAI = require('./ChessAI');
const TrainingDataGenerator = require('./TrainingDataGenerator');
const path = require('path');

async function trainModel() {
  try {
    // Initialize the AI and data generator
    const ai = new ChessAI();
    const dataGenerator = new TrainingDataGenerator();

    console.log('Generating training data...');
    
    // Generate random positions for initial training
    dataGenerator.generateRandomPositions(1000);
    
    // If you have PGN files, you can load them like this:
    // await dataGenerator.generateFromPGNFile(path.join(__dirname, 'games.pgn'));
    
    console.log(`Generated ${dataGenerator.getSize()} positions`);

    // Initialize the model
    await ai.initialize();

    console.log('Starting training...');
    
    // Train the model
    await ai.train(
      dataGenerator.positions,
      dataGenerator.evaluations,
      20  // epochs
    );

    console.log('Training completed');

    // Save the trained model
    const modelPath = path.join(__dirname, 'models', 'chess_model');
    await ai.saveModel(modelPath);
    console.log(`Model saved to ${modelPath}`);

    // Test the model
    const testPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // Starting position
    const bestMove = await ai.getBestMove(testPosition);
    console.log('Test move for starting position:', bestMove);

  } catch (error) {
    console.error('Error during training:', error);
  }
}

// Run the training
trainModel().then(() => {
  console.log('Training script completed');
}).catch(error => {
  console.error('Fatal error:', error);
}); 
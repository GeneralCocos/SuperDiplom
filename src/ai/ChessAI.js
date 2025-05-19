const tf = require('@tensorflow/tfjs-node');
const Chess = require('chess.js');

class ChessAI {
  constructor() {
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    // Create a sequential model
    this.model = tf.sequential();

    // Input layer: 8x8x12 (8x8 board, 12 piece types including empty squares)
    // Plus additional features like castling rights, en passant, etc.
    this.model.add(tf.layers.conv2d({
      inputShape: [8, 8, 13],
      filters: 64,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));

    // Additional convolutional layers
    this.model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));

    this.model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));

    // Flatten the output
    this.model.add(tf.layers.flatten());

    // Dense layers
    this.model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
    
    // Output layer: Move evaluation score
    this.model.add(tf.layers.dense({ units: 1, activation: 'tanh' }));

    // Compile the model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    this.initialized = true;
  }

  // Convert chess position to tensor
  boardToTensor(fen) {
    const chess = new Chess(fen);
    const board = chess.board();
    const tensor = tf.zeros([8, 8, 13]);

    // Map pieces to channels
    const pieceMap = {
      'p': 0, 'P': 1,  // pawns
      'n': 2, 'N': 3,  // knights
      'b': 4, 'B': 5,  // bishops
      'r': 6, 'R': 7,  // rooks
      'q': 8, 'Q': 9,  // queens
      'k': 10, 'K': 11 // kings
    };

    // Fill the tensor with piece positions
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const channel = pieceMap[piece.type];
          tensor.set(1, [i, j, channel]);
        }
      }
    }

    // Add extra features (channel 12)
    // - Castling rights
    // - En passant
    // - Turn
    // - etc.

    return tensor;
  }

  async train(positions, evaluations, epochs = 10) {
    if (!this.initialized) await this.initialize();

    const xs = tf.stack(positions.map(pos => this.boardToTensor(pos)));
    const ys = tf.tensor(evaluations);

    await this.model.fit(xs, ys, {
      epochs,
      batchSize: 32,
      validationSplit: 0.1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
        }
      }
    });
  }

  async evaluatePosition(fen) {
    if (!this.initialized) await this.initialize();

    const tensor = this.boardToTensor(fen);
    const prediction = await this.model.predict(tensor.expandDims(0));
    return prediction.dataSync()[0];
  }

  async getBestMove(fen, depth = 3) {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    let bestMove = null;
    let bestEval = chess.turn() === 'w' ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      const evaluation = await this.evaluatePosition(chess.fen());
      chess.undo();

      if (chess.turn() === 'w') {
        if (evaluation > bestEval) {
          bestEval = evaluation;
          bestMove = move;
        }
      } else {
        if (evaluation < bestEval) {
          bestEval = evaluation;
          bestMove = move;
        }
      }
    }

    return bestMove;
  }

  // Save model weights
  async saveModel(path) {
    if (!this.initialized) throw new Error('Model not initialized');
    await this.model.save(`file://${path}`);
  }

  // Load model weights
  async loadModel(path) {
    this.model = await tf.loadLayersModel(`file://${path}`);
    this.initialized = true;
  }
}

module.exports = ChessAI; 
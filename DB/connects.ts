const Conmongoose= require('mongoose');
const maxRetryAttempts = 3;
const retryDelayMs = 3000;
let retryAttempts = 0;
  function connectWithRetry() {
    Conmongoose.connect(process.env.DB)
      .then(() => {
        console.log('MongoDB connected successfully');
      })
      .catch((error:Error) => {
        console.error(`MongoDB connection error: ${error.message}`);
        retryAttempts++;
        if (retryAttempts < maxRetryAttempts) {
          console.log(`Retrying connection attempt ${retryAttempts} in ${retryDelayMs} ms`);
          setTimeout(connectWithRetry, retryDelayMs);
        } else {
          console.error(`Max retry attempts (${maxRetryAttempts}) reached. Exiting...`);
          process.exit(1);
        }
      });
  }
  
  connectWithRetry();
/**
   * Create By king Badboi .
   * Contact Me on wa.me/2348140825959
*/
// Import required modules
const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');
const { startupPassword } = require('./token');

const AUTH_FILE = './database/auth.json'; // file to store authentication state
const startpairing = require('./pair');

// Utility function to create delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const autoLoadPairs = async () => {
  console.log(chalk.yellow('🔄 Auto-loading all paired users...'));

  const pairingDir = './IGRIS-XD/pairing/';
  if (!fs.existsSync(pairingDir)) {
    console.log(chalk.red('❌ Pairing directory not found.'));
    return;
  }

  const pairUsers = fs.readdirSync(pairingDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => {
      // Accept any directory that looks like a phone number or WhatsApp format
      // This is more flexible for different folder naming conventions
      return /^\d/.test(name) || name.includes('@s.whatsapp.net');
    })
    .map(name => {
      // Ensure all entries end with @s.whatsapp.net for consistency
      return name.endsWith('@s.whatsapp.net') ? name : name + '@s.whatsapp.net';
    });

  if (pairUsers.length === 0) {
    console.log(chalk.yellow('ℹ️ No paired users found.'));
    return;
  }

  console.log(chalk.green(`✅ Found ${pairUsers.length} users. Starting connections...`));

  // Add initial delay before starting connections
  console.log(chalk.blue('⏳ Waiting 10 seconds before starting connections...'));
  await delay(10000);

  for (let i = 0; i < pairUsers.length; i++) {
    const user = pairUsers[i];
    
    try {
      console.log(chalk.blue(`🔄 Connecting user ${i + 1}/${pairUsers.length}: ${user}`));
      
      await startpairing(user);
      console.log(chalk.green(`✅ Connected: ${user}`));
      
      // Add delay between connections (except for the last user)
      if (i < pairUsers.length - 1) {
        console.log(chalk.blue(`⏳ Waiting 10 seconds before next connection...`));
        await delay(10000);
      }
      
    } catch (e) {
      console.log(chalk.red(`❌ Failed for ${user}: ${e.message}`));
      
      // Add delay even on error to prevent overwhelming the system
      if (i < pairUsers.length - 1) {
        console.log(chalk.blue(`⏳ Waiting 10 seconds before retry/next connection...`));
        await delay(10000);
      }
    }
  }

  console.log(chalk.green('✅ All paired users processed.'));
  
  // Add final delay before continuing
  console.log(chalk.blue('⏳ Waiting 10 seconds before continuing...'));
  await delay(10000);
};

// Modified to use async/await properly
const initializeBot = async () => {
  await autoLoadPairs(); // Wait for auto-loading to complete
  
  // If already authenticated, launch directly
  if (isAuthenticated()) {
    console.log(chalk.green('Welcome back! Skipping password...'));
    launchBot();
  } else {
    // Prompt for password
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.stdoutMuted = true;

    console.log(chalk.bold.yellow('Enter password to start bot: '));

    rl.question(chalk.green('Password: '), function (input) {
      if (input !== startupPassword) {
        console.log(chalk.red('\n❌ Incorrect password. Exiting...'));
        process.exit(1);
      }
      console.log(chalk.green('\n✅ Password correct. Booting Telegram bot...'));
      setAuthenticated(true);
      rl.close();
      launchBot();
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted) rl.output.write("*");
      else rl.output.write(stringToWrite);
    };
  }
};

function isAuthenticated() {
  return fs.existsSync(AUTH_FILE) && JSON.parse(fs.readFileSync(AUTH_FILE)).authenticated;
}

function setAuthenticated(value) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ authenticated: value }));
}

// Telegram bot launcher
function launchBot() {
  console.clear();
  console.log(chalk.green('Starting Telegram bot...'));
  
  // Only start the Telegram bot
  require('./bot');
  
  console.log(chalk.green('✅ Telegram bot started successfully!'));

  // Error handling for the Telegram bot
  const ignoredErrors = [
    'Socket connection timeout',
    'EKEYTYPE',
    'item-not-found',
    'rate-overlimit',
    'Connection Closed',
    'Timed Out',
    'Value not found',
  ];

  process.on('unhandledRejection', (reason) => {
    if (ignoredErrors.some((e) => String(reason).includes(e))) return;
    console.log('Unhandled Rejection: ', reason);
  });

  const originalConsoleError = console.error;
  console.error = function (message, ...optionalParams) {
    if (
      typeof message === 'string' &&
      ignoredErrors.some((e) => message.includes(e))
    )
      return;
    originalConsoleError.apply(console, [message, ...optionalParams]);
  };

  const originalStderrWrite = process.stderr.write;
  process.stderr.write = function (message, encoding, fd) {
    if (
      typeof message === 'string' &&
      ignoredErrors.some((e) => message.includes(e))
    )
      return;
    originalStderrWrite.apply(process.stderr, arguments);
  };
}

// Initialize the bot with proper async handling
initializeBot().catch(console.error);
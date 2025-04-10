#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { generateIcons } = require('./src/generator');
const packageJson = require('./package.json');

program
  .name('rn-app-icons')
  .description('Generate app icons for React Native applications')
  .version(packageJson.version)
  .requiredOption('-i, --input <path>', 'Path to the source image (PNG format recommended)')
  .option('-o, --output <path>', 'Output directory for generated icons', './app-icons')
  .option('-p, --platforms <platforms>', 'Platforms to generate icons for (ios, android, or both)', 'both')
  .option('-c, --clear', 'Clear the output directory before generating new icons', false)
  .option('-d, --no-detect', 'Disable auto-detection of project structure (auto-detection is enabled by default)')
  .option('-n, --notification', 'Generate notification icons for Android', false)
  .option('--debug', 'Enable debug mode with verbose logging', false)
  .action(async (options) => {
    try {
      console.log(chalk.blue('\n🚀 React Native App Icons Generator'));
      console.log(chalk.gray(`v${packageJson.version}\n`));

      // Validate input file
      if (!fs.existsSync(options.input)) {
        console.error(chalk.red(`Error: Input file not found at ${options.input}`));
        process.exit(1);
      }

      // Validate platforms
      const validPlatforms = ['ios', 'android', 'both'];
      if (!validPlatforms.includes(options.platforms)) {
        console.error(chalk.red(`Error: Invalid platform "${options.platforms}". Use ios, android, or both`));
        process.exit(1);
      }

      // Create output directory if it doesn't exist
      fs.ensureDirSync(options.output);

      // Clear output directory if requested
      if (options.clear) {
        console.log(chalk.yellow(`Clearing output directory: ${options.output}`));
        fs.emptyDirSync(options.output);
      }

      // Set debug mode
      if (options.debug) {
        console.log(chalk.yellow('Debug mode enabled. Verbose logging will be shown.'));
        console.log(chalk.gray(`Options: ${JSON.stringify(options, null, 2)}`));

        console.log(chalk.gray(`Auto-detect is ${options.detect ? 'enabled' : 'disabled'}`));
      }

      // Generate icons
      await generateIcons({
        inputPath: options.input,
        outputPath: options.output,
        platforms: options.platforms,
        autoDetect: options.detect,
        debug: options.debug,
        notification: options.notification
      });

      console.log(chalk.green('\n✅ App icons generated successfully!'));
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';

console.log("Welcome to the MEXN-template, let's get started! 🏃");

const FRONTEND_FRAMEWORKS = ['React', 'Vue']; // Angular soon to be added
const BACKEND_FRAMEWORKS = ['Express', 'NestJS'];
const DATABASES = ['MongoDB']; // PostgreSQL soon to be added

function executeCommand(command) {
	execSync(command, { stdio: 'inherit' });
}

function setProjectName(name) {
	console.log(`[MEXN] Project name: ${name}`);

	fs.writeFileSync('.env', `PROJECT_NAME=${name}`, { encoding: 'utf-8' });
}

async function createFrontend(frontend) {
	function constructCommand(command) {
		return `
			mkdir -p client &&
			cd client && 
			${command} . &&
			cp ../config/client/* .
		`;
	}

	switch (frontend) {
		case FRONTEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating React app...`);

			executeCommand(constructCommand('npx create-react-app'));

			break;
		case FRONTEND_FRAMEWORKS[1]:
			console.log(`[MEXN] Creating Vue app...`);

			executeCommand(constructCommand('npx @vue/cli vue create'));

			break;
		default:
			console.log('[MEXN] No frontend framework selected.');
			break;
	}
}

async function createBackend(backend) {
	function constructCommand(command) {
		return `
			mkdir -p server &&
			cd server &&
			${command} . &&
			cp ../config/server/* .
		`;
	}

	switch (backend) {
		case BACKEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating Express app...`);

			executeCommand(constructCommand('git clone https://github.com/thebetar/Express-template'));

			break;
		case BACKEND_FRAMEWORKS[1]:
			console.log(`[MEXN] Creating NestJS app...`);

			executeCommand(constructCommand('npx -p @nestjs/cli nest new'));

			break;
		default:
			console.log('[MEXN] No backend framework selected.');
			break;
	}
}

async function createDatabase(database) {
	switch (database) {
		case DATABASES[0]:
			console.log(`[MEXN] Creating MongoDB database...`);
			break;
		default:
			console.log('[MEXN] No database selected.');
			break;
	}
}

(async function () {
	const projectData = await inquirer.prompt([
		{
			name: 'project-name',
			type: 'input',
			message: 'What is the name of your project? (kebab-case)',
		},
		{
			name: 'frontend-framework',
			type: 'list',
			message: 'Which frontend framework do you want to use?',
			choices: FRONTEND_FRAMEWORKS,
		},
		{
			name: 'backend-framework',
			type: 'list',
			message: 'Which backend framework do you want to use?',
			choices: BACKEND_FRAMEWORKS,
		},
		{
			name: 'database',
			type: 'list',
			message: 'Which database do you want to use?',
			choices: DATABASES,
		},
	]);

	console.info('\nProject data: \n');
	console.info(
		Object.keys(projectData)
			.map((key) => `${key}: ${projectData[key]}`)
			.join('\n'),
	);

	const check = await inquirer.prompt([
		{
			name: 'check',
			type: 'confirm',
			message: 'Is this correct?',
		},
	]);

	if (check.check) {
		setProjectName(projectData['project-name']);
		await createFrontend(projectData['frontend-framework']);
		await createBackend(projectData['backend-framework']);
		await createDatabase(projectData['database']);

		console.log('Creating project...');
	}
})();

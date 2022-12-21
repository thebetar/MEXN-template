import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';

console.log("Welcome to the MEXN-template, let's get started! 🏃");

const FRONTEND_FRAMEWORKS = ['React', 'Vue', 'Angular'];
const BACKEND_FRAMEWORKS = ['Express', 'NestJS'];
const DATABASES = ['MongoDB', 'PostgreSQL (not yet supported)'];

function executeCommand(command) {
	execSync(command, { stdio: 'inherit' });
}

function setProjectName(name) {
	console.log(`[MEXN] Project name: ${name}`);

	fs.writeFileSync('.env', `PROJECT_NAME=${name}`, { encoding: 'utf-8' });
}

async function createFrontend(frontend) {
	switch (frontend) {
		case FRONTEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating React app...`);

			executeCommand('cd client && npx -p create-react-app create-react-app .');

			break;
		case FRONTEND_FRAMEWORKS[1]:
			console.log(`[MEXN] Creating Vue app...`);

			executeCommand('cd client && npx -p @vue/cli vue create .');

			break;
		case FRONTEND_FRAMEWORKS[2]:
			console.log(`[MEXN] Creating Angular app...`);

			executeCommand('cd client && npx -p @angular/cli ng new .');

			break;
		default:
			console.log('[MEXN] No frontend framework selected.');
			break;
	}
}

async function createBackend(backend) {
	switch (backend) {
		case BACKEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating Express app...`);

			executeCommand('cd server && git clone https://github.com/thebetar/Express-template .');

			break;
		case BACKEND_FRAMEWORKS[1]:
			console.log(`[MEXN] Creating NestJS app...`);

			executeCommand('cd server && npx -p @nestjs/cli nest new .');

			break;
		default:
			console.log('[MEXN] No backend framework selected.');
			break;
	}
}

async function createDatabase(database) {
	switch (database) {
		case DATABASES[0]:
			console.log(`[MEXN] Creating ${DATABASES[0]} app...`);
			break;
		case DATABASES[1]:
			console.log(`[MEXN] Creating ${DATABASES[1]} app...`);
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

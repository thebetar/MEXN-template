import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';

console.log("Welcome to the MEXN-template, let's get started! 🏃");

const FRONTEND_FRAMEWORKS = ['React', 'Vue', 'Angular']; // Angular maybe later
const BACKEND_FRAMEWORKS = ['Express', 'NestJS'];
const DATABASES = ['MongoDB', 'postgres'];
const ORM = ['Mongoose', 'Prisma', 'TypeORM'];

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
			cp ${process.cwd()}/config/client/* .
		`;
	}

	switch (frontend) {
		case FRONTEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating React app...`);

			executeCommand(constructCommand('npx create-react-app'));

			break;
		case FRONTEND_FRAMEWORKS[1]:
			console.log(`[MEXN] Creating Vue app...`);

			executeCommand(constructCommand('npx @vue/cli create'));

			break;
		case FRONTEND_FRAMEWORKS[2]:
			console.log(`[MEXN] Creating Angular app...`);

			executeCommand(constructCommand('npx @angular/cli new client --directory'));

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
			cp ${process.cwd()}/config/server/* .
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

async function createDatabase(database, projectName) {
	switch (database) {
		case DATABASES[0]:
			console.log(`[MEXN] Creating MongoDB database...`);

			executeCommand(`
				cd db && 
				docker run -d -p 27017:27017 -v ${process.cwd()}/db/data:/data/db --name ${projectName}-db mongo
			`);

			break;
		case DATABASES[1]:
			console.log(`[MEXN] Creating PostgreSQL database...`);

			executeCommand(`
				cd db && 
				docker run -d -p 5432:5432 -v ${process.cwd()}/db/data:/var/lib/postgresql/data --name ${projectName}-db postgres	
			`);

			break;
		default:
			console.log('[MEXN] No database selected.');
			break;
	}
}

async function createORM(orm, database) {
	switch (orm) {
		case ORM[0]:
			console.log(`[MEXN] Creating Mongoose ORM...`);

			executeCommand(`
				cd server &&
				npm i mongoose
			`);

			break;
		case ORM[1]:
			console.log(`[MEXN] Creating Prisma ORM...`);

			executeCommand(`
				cd server &&
				npm i prisma &&
				npx prisma init &&
				cp -r ${process.cwd()}/config/server/prisma/${database.toLowerCase()}.prisma ${process.cwd()}/server/prisma/schema.prisma
			`);

			break;
		case ORM[2]:
			console.log(`[MEXN] Creating TypeORM ORM...`);

			executeCommand(`
					cd server &&
					npm i typeorm
				`);

			break;
		default:
			console.log('[MEXN] No ORM selected.');
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
		{
			name: 'orm',
			type: 'list',
			message: (answers) => {
				if (answers['backend-framework'] === BACKEND_FRAMEWORKS[1]) {
					return 'Which ORM do you want to use? (NestJS recommends TypeORM)';
				}

				if (answers.database === DATABASES[0]) {
					return 'Which ORM do you want to use? (MongoDB recommends Mongoose)';
				}

				return 'Which ORM do you want to use?';
			},
			choices: (answers) => {
				switch (answers.database) {
					case DATABASES[0]:
						return ORM;
					case DATABASES[1]:
						return ORM.slice(1, 3);
					default:
						return [];
				}
			},
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
		await createDatabase(projectData['database'], projectData['project-name']);
		await createORM(projectData['orm'], projectData['database']);

		console.log('Creating project...');
	}
})();

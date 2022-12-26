import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';

console.log("Welcome to the MEXN-template, let's get started! 🏃");

const FRONTEND_FRAMEWORKS = ['React', 'Vue', 'Angular']; // Angular maybe later
const FRONTEND_COMPONENT_FRAMEWORKS = ['Bootstrap', 'Material UI', 'Tailwind CSS', 'None'];
const BACKEND_FRAMEWORKS = ['Express', 'NestJS'];
const DATABASES = ['MongoDB', 'postgres'];
const ORM = ['Mongoose', 'Prisma', 'TypeORM', 'None'];

function executeCommand(command) {
	execSync(command, { stdio: 'inherit' });
}

function setProjectName(name) {
	console.log(`[MEXN] Project name: ${name}`);

	fs.writeFileSync('.env', `PROJECT_NAME=${name}`, { encoding: 'utf-8' });
}

async function createFrontend(frontend, componentFramework, tailwind) {
	function constructCommand(command) {
		return `
			mkdir -p client &&
			${command} client &&
			cp ${process.cwd()}/config/client/* client
		`;
	}

	switch (frontend) {
		case FRONTEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating React app...`);

			executeCommand(constructCommand('npx create-react-app'));

			if (componentFramework === FRONTEND_COMPONENT_FRAMEWORKS[0]) {
				console.log(`[MEXN] Adding Bootstrap...`);

				executeCommand(`
					cd client &&
					npm i bootstrap react-bootstrap
				`);
			} else if (componentFramework === FRONTEND_COMPONENT_FRAMEWORKS[1]) {
				console.log(`[MEXN] Adding Material UI...`);

				executeCommand(`
					cd client &&
					npm i @mui/material @emotion/react @emotion/styled
				`);
			}

			break;
		case FRONTEND_FRAMEWORKS[1]:
			console.log(`[MEXN] Creating Vue app...`);

			executeCommand(constructCommand('npx @vue/cli create'));

			if (componentFramework === FRONTEND_COMPONENT_FRAMEWORKS[0]) {
				console.log(`[MEXN] Adding Bootstrap...`);

				executeCommand(`
					cd client &&
					npm i bootstrap-vue bootstrap
				`);
			} else if (componentFramework === FRONTEND_COMPONENT_FRAMEWORKS[1]) {
				console.log(`[MEXN] Adding Material UI...`);

				executeCommand(`
					cd client &&
					npx @vue/cli add vuetify
					`);
			}

			break;
		case FRONTEND_FRAMEWORKS[2]:
			console.log(`[MEXN] Creating Angular app...`);

			executeCommand(constructCommand('npx @angular/cli new client --directory'));

			break;
		default:
			console.log('[MEXN] No frontend framework selected.');
			break;
	}

	if (componentFramework === FRONTEND_COMPONENT_FRAMEWORKS[2] || tailwind) {
		console.log(`[MEXN] Adding Tailwind CSS...`);

		executeCommand(`
			cd client &&
			npm i tailwindcss postcss autoprefixer postcss-cli &&
			npx tailwindcss init -p
		`);
	}
}

async function createBackend(backend) {
	function constructCommand(command) {
		return `
			mkdir -p server &&
			${command} server &&
			cp ${process.cwd()}/config/server/* server
		`;
	}

	switch (backend) {
		case BACKEND_FRAMEWORKS[0]:
			console.log(`[MEXN] Creating Express app...`);

			executeCommand(constructCommand('git clone https://github.com/thebetar/Express-template --depth 1'));
			executeCommand('rm -rf server/.git');

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
	function constructCommand(command) {
		return `
			mkdir -p db &&
			mkdir -p db/data &&
			cd db && 
			${command}
		`;
	}

	switch (database) {
		case DATABASES[0]:
			console.log(`[MEXN] Creating MongoDB database...`);

			executeCommand(
				constructCommand(`
				docker run -d -p 27017:27017 -v ${process.cwd()}/db/data:/data/db --name ${projectName}-db mongo
			`),
			);

			break;
		case DATABASES[1]:
			console.log(`[MEXN] Creating PostgreSQL database...`);

			executeCommand(
				constructCommand(`
				docker run -d -p 5432:5432 -v ${process.cwd()}/db/data:/var/lib/postgresql/data --name ${projectName}-db postgres	
			`),
			);

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

			const pathname = `${process.cwd()}/config/prisma/${database.toLowerCase()}.prisma`;
			console.log(pathname);

			executeCommand(`
				cd server &&
				npm i prisma &&
				npx prisma init &&
				cp -r ${pathname} ${process.cwd()}/server/prisma/schema.prisma &&
				npm i @prisma/client
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
	if (fs.existsSync('client') || fs.existsSync('server') || fs.existsSync('db')) {
		console.log('[MEXN] Project already exists.');

		const { overwrite } = await inquirer.prompt([
			{
				name: 'overwrite',
				type: 'confirm',
				message: 'Do you want to remove and overwrite the existing project?',
			},
		]);

		if (overwrite) {
			executeCommand('sudo rm -rf client server db');
		} else {
			return;
		}
	}

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
			name: 'frontend-component-framework',
			type: 'list',
			message: 'Which frontend component framework do you want to use?',
			choices: FRONTEND_COMPONENT_FRAMEWORKS,
		},
		{
			name: 'tailwind-toggle',
			type: 'list',
			message: 'Do you want to use Tailwind CSS?',
			choices: ['Yes', 'No'],
			when: (answers) => answers['frontend-component-framework'] !== FRONTEND_COMPONENT_FRAMEWORKS[2] && answers['frontend-component-framework'] !== FRONTEND_FRAMEWORKS[3],
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

	const console_object = {};

	for (const key in projectData) {
		const parsedKey = key.split('-').join(' ');
		console_object[`${parsedKey.charAt(0).toUpperCase()}${parsedKey.slice(1)}`] = projectData[key];
	}

	console.info('\nProject data:');
	console.table(console_object);

	const check = await inquirer.prompt([
		{
			name: 'check',
			type: 'confirm',
			message: 'Is this correct?',
		},
	]);

	if (check.check) {
		setProjectName(projectData['project-name']);
		await createFrontend(projectData['frontend-framework'], projectData['frontend-component-framework'], projectData['tailwind-toggle']);
		await createBackend(projectData['backend-framework']);
		await createDatabase(projectData['database'], projectData['project-name']);
		await createORM(projectData['orm'], projectData['database']);

		console.log('Creating project...');
	}
})();

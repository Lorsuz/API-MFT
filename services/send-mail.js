import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.js';

async function createNewUser ( to ) {
	try {
		const config = await mailConfig();

		const transporter = nodemailer.createTransport( config );

		const info = await transporter.sendMail( {
			from: "domap22290@ustorp.com",
			to: to,
			subject: 'Conta criada no Invest App',
			text: `Conta criada com sucesso.\n\nAcesse o aplicativo `,
			html: `<h1>Conta criada com sucesso.</h1><p>Acesse o aplicativo.</p>`,
		} );

		if ( process.env.NODE_ENV === 'development' ) {
			console.log( `Send email: ${ nodemailer.getTestMessageUrl( info ) }` );
		}
	} catch ( err ) {
		throw new Error( err );
	}
}

async function requestAdmin ( from ) {
	try {
		const config = await mailConfig();

		const transporter = nodemailer.createTransport( config );

		const info = await transporter.sendMail( {
			from: from,
			to: "ariel2005souza@gmail.com",
			subject: 'Existe um novo pedido de conta de usuario no Invest App',
			text: `Conta criada com sucesso.\n\nAcesse o aplicativo para gerenciar o cadastro da nova conta admin.`,
			html: `<h1>Conta criada com sucesso.</h1><p>Acesse o aplicativo.</p>`,
		} );

		if ( process.env.NODE_ENV === 'development' ) {
			console.log( `Send email to adm: ${ nodemailer.getTestMessageUrl( info ) }` );
		}
	} catch ( err ) {
		throw new Error( err );
	}
}

async function createNews ( news, to ) {
	try {
		const config = await mailConfig();

		const transporter = nodemailer.createTransport( config );

		const info = await transporter.sendMail( {
			from: "domap22290@ustorp.com",
			to: `ariel2005souza@gmail.com, ${to}`,
			subject: 'Existe um novo pedido de conta de usuario no Invest App',
			text: `Nova noticia criada:\n\n
			Nome: ${news.name};\n
			Data: ${news.release};\n
			Descrição: ${news.description};\n
			Link: ${news.link};`,
			html: `
			<h1>Nova noticia criada</h1>
			<ul>
				<li>Titulo: ${news.title};</li>
				<li>Data: ${news.release};</li>
				<li>Descrição: ${news.description};</li>
				<li>Link: ${news.link};</li>
			</ul>
			`,
		} );

		if ( process.env.NODE_ENV === 'development' ) {
			console.log( `Send email to adm: ${ nodemailer.getTestMessageUrl( info ) }` );
		}
	} catch ( err ) {
		throw new Error( err );
	}
}

export default { createNewUser, requestAdmin, createNews };
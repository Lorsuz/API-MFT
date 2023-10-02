import { z } from 'zod';

const loginSchema = z.object( {
	email: z.string().email( 'O email fornecido não é válido.' ),
	password: z.string().min( 8, 'A senha deve ter pelo menos 8 caracteres.' ),
} );

function validateLogin ( req, res, next ) {
	const { email, password } = req.body;

	try {
		const inputData = loginSchema.parse( { email, password } );
		req.inputData = inputData;
		next();
	} catch ( error ) {
		// Se os dados de entrada não forem válidos, trate os erros
		const errorMessages = error.errors.map( ( errorMessage ) => ( {
			field: errorMessage.path.join( '.' ),
			message: errorMessage.message,
		} ) );

		next();
	}
}

export default validateLogin;

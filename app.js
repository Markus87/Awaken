const Http 	= require( 'http' )
const Express 	= require( 'express' )
const Process	= require( 'node:child_process' )

process.title = 'Awaken - Wake on LAN http proxy'

class App
{
    constructor()
    {		
		console.debug( 'App constructor called' )
		const self 			= this
	    	this.port			= 8888
		this.app 			= Express()
		this.SetupListener()	
	}
	SetupListener()
	{		
		const self = this
		Http.createServer( {}, this.app ).listen( self.port, () => {
			console.log(`server listening on port ${self.port}`)
		})
		this.app.use
			( '/Awaken'
			, function( req, res ){ self.OnAwaken( req, res ) }
			)
	}
	OnAwaken( request, result )
	{
		const query = request.query
		console.debug( 'OnAwaken', query )

		const answerWithError = function( errorMessage ){
			console.error( 'OnAwaken', errorMessage );
			result.send( errorMessage );
		};

		if( request.query.MAC === undefined )
		{
			
                        answerWithError( 'Invalid request, expected: http://ip:port/Awaken?MAC=0f:0f:0f:0f:0f:0f' );
                        return;
		}


		const macVerifier = /([0-9,a-f]{2}\:){5}[0-9,a-f]{2}/;
		if( !macVerifier.test( request.query.MAC ) )
		{
			answerWithError( 'MAC is invalid, expected format => 0f:0f:0f:0f:0f:0f' );
			return;
		}

		const args = [ request.query.MAC ];
		const processResult = Process.spawnSync( 'wol', args );
		
		console.debug( processResult.output.toString() );
		result.send( processResult.output.toString() );
	}
}

function Main()
{   
    new App()
}

Main()
